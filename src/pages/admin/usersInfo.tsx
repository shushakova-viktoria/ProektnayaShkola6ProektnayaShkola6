import { supabase } from "../../shared/supabaseClient";
import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';



function UsersList() {
    const [data, setData] = useState(new Array<Object>());
    
  
    useEffect(() => {
      const fetchData = async () => {
        const { data } = await supabase.from('users').select();
        console.log(data);
        if (data) {
          setData(data);
        }
      };
      fetchData();
    }, []);

    async function addUser() {
        const newName: any =  document.getElementById('newFirstName');
        const newSurname: any =  document.getElementById('newLastName');
        if (newName && newSurname && newName.value && newSurname.value) {
            try {
              const { error } = await supabase.from('users').insert({
                first_name: newName.value,
                last_name: newSurname.value
              });
              if (!error) {
                const { data } = await supabase.from('users').select();
                if (data) {
                  setData(data);  
                }
              } else {
                console.error('Ошибка при добавлении пользователя:', error);
              }
            } catch (error) {
              console.error('Произошла ошибка при запросе к Supabase:', error);
            }
          } else {
            console.error('Пожалуйста, заполните все поля.');
          }
        }

    async function deleteUser(id: number){
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (!error) {
            const { data } = await supabase.from('users').select();
            if (data) {
            setData(data);
            }
        }
          
    }


    const columns = [
        {
          title: "Имя",
          dataIndex: "first_name",
        },
    
        {
          title: 'Фамилия',
          dataIndex: 'last_name',
        },
        {
          title: 'Дата создания аккаунта',
          dataIndex: 'created_at',
        },

        {
            title: 'Время последнего изменения',
            dataIndex: 'updated_at',
        },
        {
            title: "Удалить пользователя",
            dataindex: '',
            render: (record: {id: number}) => (
              data.length >= 1 ? (
                <a onClick={() => deleteUser(record.id)}>Удалить</a>
              ) : null
            )
        },
    ];

    return (
        <>
    <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newFirstName' type = 'text' placeholder='Имя' />
      <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newLastName' type = 'text' placeholder='Фамилия' />
      <Button onClick={addUser} type='primary'>
      Добавить нового пользователя
      </Button>

        <Table pagination={false} dataSource={data} columns={columns} rowKey = "id"/>
        
        </>
    );
}

export default UsersList;

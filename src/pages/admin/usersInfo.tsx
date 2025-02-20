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
        const newAge: any = document.getElementById('newAge');
        if (newName && newSurname && newAge && newName.value && newSurname.value && newAge.value) {
            try {
              const { error } = await supabase.from('users').insert({
                first_name: newName.value,
                last_name: newSurname.value,
                age: newAge.value,
              });
              if (!error) {
                const { data } = await supabase.from('users').select();
                if (data) {
                  setData(data);  
                }
              } else {
                console.error('Error adding user:', error);
              }
            } catch (error) {
              console.error('An error occurred while querying Supabase:', error);
            }
          } else {
            console.error('Please, fill out all fields!');
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
          title: "Name",
          dataIndex: "first_name",
        },
    
        {
          title: 'Surname',
          dataIndex: 'last_name',
        },
        {
          title: 'Account creation date',
          dataIndex: 'created_at',
        },
        {
          title: 'Age',
          dataIndex: 'age',

        },

        {
            title: 'Last modified time',
            dataIndex: 'updated_at',
        },
        {
            title: "Delete user",
            dataindex: '',
            render: (record: {id: number}) => (
              data.length >= 1 ? (
                <a onClick={() => deleteUser(record.id)}>Delete</a>
              ) : null
            )
        },
    ];

    return (
        <>
    <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newFirstName' type = 'text' placeholder='Name' />
      <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newLastName' type = 'text' placeholder='Surname' />
      <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newAge' type = 'text' placeholder='Age' />
      <Button onClick={addUser} type='primary'>
      
      Add a new user
      </Button>

        <Table pagination={false} dataSource={data} columns={columns} rowKey = "id"/>
        
        </>
    );
}

export default UsersList;

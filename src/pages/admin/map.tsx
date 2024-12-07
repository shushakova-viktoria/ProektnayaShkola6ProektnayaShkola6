import { Button, Table } from 'antd';
import { supabase } from '../../shared/supabaseClient';
import React, { useEffect, useState } from 'react';


function PlaceMap() {
  const [data, setData] = useState(new Array<Object>());
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState<number>(0);
  const [longtitude, setLongtitude] = useState<number>(0);
  

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('places').select();
      console.log(data);
      if (data) {
        setData(data);
      }
    };
    fetchData();
  }, []);

  async function getPlacesWithLocation() {
    const titleInput: any =  document.getElementById('newTitle');
    const locationInput: any = document.getElementById('newLocation');
    if (titleInput && locationInput) {
      console.log(locationInput.value)
      if (titleInput.value.trim() === '') {
        alert('Введите новое название!');
      } else if (locationInput.value.trim() === '') {
        alert('Введите новое местоположение!');
      } else {
        const {error} = await supabase.from('places').insert({title: titleInput.value, location: `POINT(${locationInput.value})`});
        
        if (!error) {
          const {data} = await supabase.rpc('get_places_with_location');
          data?.map(async (el: any) => {
            el.location = el.location.slice(6, -1);
          })
          if (data) {
            setData(data);
          }
        }
      }
    }
  }


  async function handleDelete(id: number) {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (!error) {
      const { data } = await supabase.from('places').select();
      if (data) {
        setData(data);
      }
    }
  }

  async function handleChange(id: number, newTitle: string) {
    const { error } = await supabase.from('places').update({ title: newTitle }).eq('id', id);
    if (!error){
      const { data } = await supabase.from('places').select();
      if (data){
        setData(data);
      }
    }
    
  }


  const columns = [
    {
      title: 'Название места',
      dataIndex: 'title',
    },
    {
      title: "Координаты",
      dataIndex: "location",
    },

    {
      title: 'Время создания',
      dataIndex: 'created_at',
    },
    {
      title: 'Время последнего изменения',
      dataIndex: 'updated_at',
    },

    {
      title: "Удалить место",
      dataindex: '',
      render: (record: {id: number}) => (
        data.length >= 1 ? (
          <a onClick={() => handleDelete(record.id)}>Удалить</a>
        ) : null
      )
    },
    {
      title: "Изменить место",
      dataindex: '',
      render: (text: string, record: {id: number}) => (
        data.length >= 1 ? (
          <a onClick={() => {const newTitle = prompt ("Введите новое название", text);
            if (newTitle){
              handleChange(record.id, newTitle);
            }

          }
        }
          >
          Редактировать существующee место
          </a>
        ) : null
      )
    }

  ];
  return (
    <>
    <div>
        <iframe
          width="100%"
          height="200px"
          src="https://yandex.ru/map-widget/v1/-/CBucU6V~8B"
        ></iframe>
      </div>
      <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newTitle' type = 'text' placeholder='Название места' />
      <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newLocation' type = 'text' placeholder='Координаты (89.56 89.34)' />
      <Button onClick={getPlacesWithLocation} type='primary'>
      Добавить новое место
      </Button>

    
      <Table pagination={false} dataSource={data} columns={columns} rowKey = "id" />
    </>
  );
}


  
export default PlaceMap;
import { Button, Table } from 'antd';
import { supabase } from '../../shared/supabaseClient';
import { useEffect, useState } from 'react';


interface Place {
  id: number;
  title: string;
  location: string;
  created_at: string;
  updated_at: string;
}

function PlaceMap() {
  const [data, setData] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('places').select();
      if (error) {
        console.error('Error loading data', error);
      } else {
        console.log(data);
        setData(data || []);
      }
    };
    fetchData();
  }, []);

  // Функция добавления нового места
  async function getPlacesWithLocation() {
    const titleInput = document.getElementById('newTitle') as HTMLInputElement;
    const locationInput = document.getElementById('newLocation') as HTMLInputElement;
    if (titleInput && locationInput) {
      const title = titleInput.value.trim();
      const location = locationInput.value.trim();

      if (!title) {
        alert('Enter a new name');
      } else if (!location) {
        alert('Enter a new location');
      } else {
        const { error } = await supabase
          .from('places')
          .insert({ title: title, location: `POINT(${location})` });

        if (!error) {
          const { data, error } = await supabase.rpc('get_places_with_location');
          if (error) {
            console.error('RPC call failed', error);
          } else {
            // Обработка данных, если необходимо (например, парсинг location)
            data?.map((el: Place) => {
              el.location = el.location.slice(6, -1); // Убираем "POINT()" вокруг координат
            });
            setData(data || []);
          }
        }
      }
    }
  }

  // Удаление места
  async function handleDelete(id: number) {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (!error) {
      const { data } = await supabase.from('places').select();
      setData(data || []);
    }
  }

  // Изменение названия места
  async function handleChange(id: number, newTitle: string) {
    const { error } = await supabase.from('places').update({ title: newTitle }).eq('id', id);
    if (!error) {
      const { data } = await supabase.from('places').select();
      setData(data || []);
    }
  }

  // Столбцы для таблицы
  const columns = [
    {
      title: 'Place name',
      dataIndex: 'title',
    },
    {
      title: 'Coordinates',
      dataIndex: 'location',
    },
    {
      title: 'Creation time',
      dataIndex: 'created_at',
    },
    {
      title: 'Last modified time',
      dataIndex: 'updated_at',
    },
    {
      title: 'Delete place',
      render: (record: Place) => (
        <a onClick={() => handleDelete(record.id)}>Delete</a>
      ),
    },
    {
      title: 'Change location',
      render: (text: string, record: Place) => (
        <a
          onClick={() => {
            const newTitle = prompt('Enter a new name', text);
            if (newTitle) {
              handleChange(record.id, newTitle);
            }
          }}
        >
          Edit an existing place
        </a>
      ),
    },
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
      <input
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          outline: 'none',
          border: '1px gray solid',
          margin: '1rem',
          boxShadow: '4px 4px 10px gray',
        }}
        id="newTitle"
        type="text"
        placeholder="Place name"
      />
      <input
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          outline: 'none',
          border: '1px gray solid',
          margin: '1rem',
          boxShadow: '4px 4px 10px gray',
        }}
        id="newLocation"
        type="text"
        placeholder="Coordinates (89.56 89.34)"
      />
      <Button onClick={getPlacesWithLocation} type="primary">
      Add a new location
      </Button>

      <Table pagination={false} dataSource={data} columns={columns} rowKey="id" />
    </>
  );
}

export default PlaceMap;






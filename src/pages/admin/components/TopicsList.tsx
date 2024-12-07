import { Button, Table } from 'antd';
import { supabase } from '../../../shared/supabaseClient';
import { useEffect, useState } from 'react';

interface Topic {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

function TopicsList() {
  const [data, setData] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('topics').select();
      console.log(data);
      if (data) {
        setData(data);
      }
    };
    fetchData();
  }, []);

  async function handleAdd() {
    const newTitle = document.getElementById('newTitle') as HTMLInputElement;
    if (newTitle) {
      const { error } = await supabase.from('topics').insert({ title: newTitle.value });
      if (!error) {
        const { data } = await supabase.from('topics').select();
        if (data) {
          setData(data);
        }
      }
    }
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (!error) {
      const { data } = await supabase.from('topics').select();
      if (data) {
        setData(data);
      }
    }
  }

  async function handleChange(id: number, newTitle: string) {
    const { error } = await supabase.from('topics').update({ title: newTitle }).eq('id', id);
    if (!error) {
      const { data } = await supabase.from('topics').select();
      if (data) {
        setData(data);
      }
    }
  }

  const columns = [
    {
      title: 'Название интереса',
      dataIndex: 'title',
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
      title: 'Удалить интерес',
      dataIndex: '',
      render: (record: { id: number }) => (
        data.length >= 1 ? (
          <a onClick={() => handleDelete(record.id)}>Удалить</a>
        ) : null
      ),
    },
    {
      title: 'Изменить интерес',
      dataIndex: '',
      render: (text: string, record: { id: number }) => (
        data.length >= 1 ? (
          <a onClick={() => {
            const newTitle = prompt('Введите новое название', text);
            if (newTitle) {
              handleChange(record.id, newTitle);
            }
          }}>
            Редактировать существующий интерес
          </a>
        ) : null
      ),
    },
  ];

  return (
    <>
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
        placeholder="Название интереса"
      />
      <Button onClick={handleAdd} type="primary">
        Добавить интерес
      </Button>

      <Table pagination={false} dataSource={data} columns={columns} rowKey="id" />
    </>
  );
}

export default TopicsList;
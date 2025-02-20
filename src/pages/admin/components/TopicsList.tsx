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
      title: 'Interest name',
      dataIndex: 'title',
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
      title: 'Remove interest',
      dataIndex: '',
      render: (record: { id: number }) => (
        data.length >= 1 ? (
          <a onClick={() => handleDelete(record.id)}>Remove</a>
        ) : null
      ),
    },
    {
      title: 'Change interest',
      dataIndex: '',
      render: (text: string, record: { id: number }) => (
        data.length >= 1 ? (
          <a onClick={() => {
            const newTitle = prompt('Change interest', text);
            if (newTitle) {
              handleChange(record.id, newTitle);
            }
          }}>
            Edit an existing interest
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
        placeholder="Interest name"
      />
      <Button onClick={handleAdd} type="primary">
        Add interest
      </Button>

      <Table pagination={false} dataSource={data} columns={columns} rowKey="id" />
    </>
  );
}

export default TopicsList;
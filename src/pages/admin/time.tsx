import { Button, Table } from 'antd';
import { supabase } from '../../shared/supabaseClient';
import { useEffect, useState } from 'react';

interface time {
    id: number;
    age: string;
    created_at: string;
}

function TimeList() {
    const [data, setData] = useState<time[]>([]);
    useEffect(() => {
      const fetchData = async () => {
        const { data } = await supabase.from('time').select();
        console.log(data);
        if (data) {
          setData(data);
        }
      };
      fetchData();
    }, []);

async function timeAdd() {
    const newTime = document.getElementById('newTime') as HTMLInputElement;
    if (newTime) {
      const { error } = await supabase.from('time').insert({ time: newTime.value });
      if (!error) {
        const { data } = await supabase.from('time').select();
        if (data) {
          setData(data);
        }
      }
    }
  }

  async function timeDelete(id: number) {
    const { error } = await supabase.from('time').delete().eq('id', id);
    if (!error) {
      const { data } = await supabase.from('time').select();
      if (data) {
        setData(data);
      }
    }
  }


  const columns = [
    {
      title: 'Convenient time',
      dataIndex: 'time',
    },
    {
      title: 'Creation time',
      dataIndex: 'created_at',
    },
    {
      title: 'Delete time',
      dataIndex: '',
      render: (record: { id: number }) => (
        data.length >= 1 ? (
          <a onClick={() => timeDelete(record.id)}>Delete</a>
        ) : null
      ),
    },
  ];
  return(
    <>
    <input style={{padding: '0.5rem', borderRadius: '6px', outline: 'none', border: '1px gray solid', margin: '1rem', boxShadow: '4px 4px 10px gray' }} id = 'newTime' type = 'text' placeholder='Time' />
    <Button onClick={timeAdd} type='primary'>
    Add time
      </Button>
    
    <Table pagination={false} dataSource={data} columns={columns} rowKey = "id"/>
    
    </>


  );

    
}









export default TimeList;
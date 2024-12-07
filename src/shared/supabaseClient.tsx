// здесь определяем клиент для взаимодействия с Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxxeygnuuvuqxcnlxxvp.supabase.co'; // Project URL
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eGV5Z251dXZ1cXhjbmx4eHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2OTE0MjEsImV4cCI6MjA0ODI2NzQyMX0.uNJvCUdozwqBwzfuC39q-G6PMFN2jkBUsqY9mHuXO6I'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

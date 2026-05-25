var SUPABASE_URL = 'https://cnfihgvbuejdzigypkrw.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZmloZ3ZidWVqZHppZ3lwa3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTcxMDgsImV4cCI6MjA5MzU5MzEwOH0.lBpBE1-8VgYLRRC4xv9eC6WHL2lFINXzrKvrwIueiEE';

var supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
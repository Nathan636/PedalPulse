const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://wznborfuiedewuzvaafa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bmJvcmZ1aWVkZXd1enZhYWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjQ5MTYsImV4cCI6MjA2MDA0MDkxNn0.c3Z7b8XvHFa9tDs5r5iiclDyrBZVSGkXGamOK5oGExc';
const supabase = createClient('https://wznborfuiedewuzvaafa.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bmJvcmZ1aWVkZXd1enZhYWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjQ5MTYsImV4cCI6MjA2MDA0MDkxNn0.c3Z7b8XvHFa9tDs5r5iiclDyrBZVSGkXGamOK5oGExc');

module.exports = supabase; 
import { supabase } from "./src/integrations/supabase/client";

async function check() {
  const { data, error } = await supabase.from('technologies').select('*');
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
}

check();

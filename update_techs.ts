import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  // Update Super Brilho to Estamparia Digital HD
  await supabase
    .from('technologies')
    .update({ 
      name: 'Estamparia Digital HD',
      short_description: 'Alta definição e cores vibrantes.',
      description: 'Tecnologia de estamparia digital de alta definição que garante cores vibrantes e nitidez excepcional.'
    })
    .ilike('name', '%Super Brilho%');

  // Ensure 4 Way Stretch and Zero Transparência exist or are updated
  const { data: existing } = await supabase.from('technologies').select('name');
  const names = existing?.map(e => e.name.toUpperCase()) || [];

  if (!names.includes('4 WAY STRETCH')) {
    await supabase.from('technologies').insert({
      name: '4 Way Stretch',
      slug: '4-way-stretch',
      short_description: 'Elasticidade multidirecional.',
      icon: 'Maximize',
      is_active: true,
      display_order: 10
    });
  }

  if (!names.includes('ZERO TRANSPARÊNCIA')) {
    await supabase.from('technologies').insert({
      name: 'Zero Transparência',
      slug: 'zero-transparencia',
      short_description: 'Segurança total no uso.',
      icon: 'EyeOff',
      is_active: true,
      display_order: 11
    });
  }
}

run();

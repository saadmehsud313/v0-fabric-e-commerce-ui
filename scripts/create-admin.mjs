import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminAccount() {
  try {
    console.log('Creating admin account...');
    
    const adminEmail = 'saad@kashfdigitex.com';
    const adminPassword = 'Saad@Admin2024!SecurePassword';
    const adminName = 'Saad Mehsud';

    // Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName,
        is_admin: true,
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      process.exit(1);
    }

    console.log('✓ Admin user created in auth:', authData.user.id);

    // Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: adminName,
        is_admin: true,
      })
      .select();

    if (profileError) {
      console.error('Profile error:', profileError);
      // This might fail if profiles table doesn't exist yet
    } else {
      console.log('✓ Admin profile created');
    }

    console.log('\n✓ Admin account created successfully!');
    console.log(`\nAdmin Credentials:\n`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Name: ${adminName}`);
    console.log(`\nYou can now log in with these credentials.`);

  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

createAdminAccount();

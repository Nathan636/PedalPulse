const supabase = require('./supabase');

async function viewData() {
    try {
        // View users
        console.log('=== Users ===');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');
            
        if (usersError) {
            console.error('Error fetching users:', usersError.message);
        } else {
            console.log('Users in database:');
            users.forEach(user => {
                console.log(`ID: ${user.id}`);
                console.log(`Email: ${user.email}`);
                console.log(`Name: ${user.full_name}`);
                console.log(`Phone: ${user.phone_number}`);
                console.log(`Created: ${user.created_at}`);
                console.log('---');
            });
        }

        // View rides
        console.log('\n=== Rides ===');
        const { data: rides, error: ridesError } = await supabase
            .from('rides')
            .select('*, users!inner(*)');
            
        if (ridesError) {
            console.error('Error fetching rides:', ridesError.message);
        } else {
            console.log('Rides in database:');
            rides.forEach(ride => {
                console.log(`ID: ${ride.id}`);
                console.log(`Bike ID: ${ride.bike_id}`);
                console.log(`User: ${ride.users.email}`);
                console.log(`Start Location: ${ride.start_location}`);
                console.log(`Status: ${ride.status}`);
                console.log(`Start Time: ${ride.start_time}`);
                console.log('---');
            });
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

viewData(); 
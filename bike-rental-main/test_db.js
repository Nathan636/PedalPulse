const supabase = require('./supabase');

async function updateRideResults(rideId, endLocation, totalCost) {
    try {
        const { data, error } = await supabase
            .from('rides')
            .update({
                end_time: new Date().toISOString(),
                end_location: endLocation,
                status: 'completed',
                total_cost: totalCost
            })
            .eq('id', rideId)
            .select();

        if (error) {
            console.error('Error updating ride results:', error.message);
            return null;
        }

        console.log('Successfully updated ride results:', data);
        return data[0];
    } catch (err) {
        console.error('Unexpected error:', err);
        return null;
    }
}

async function testDatabase() {
    try {
        // First, try to find the existing user
        console.log('Looking for existing user Nathan...');
        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'nathan@example.com')
            .single();

        if (findError) {
            console.error('Error finding user:', findError.message);
            return;
        }

        console.log('Found existing user:', existingUser);

        // Try to insert a test ride for Nathan
        const testRide = {
            user_id: existingUser.id,
            bike_id: 'BIKE003',
            start_time: new Date().toISOString(),
            start_location: 'Andheri East'
        };

        console.log('\nAttempting to insert test ride for Nathan...');
        const { data: insertedRide, error: rideError } = await supabase
            .from('rides')
            .insert([testRide])
            .select();

        if (rideError) {
            console.error('Error inserting test ride:', rideError.message);
            return;
        }

        console.log('Successfully inserted test ride:', insertedRide);

        // Simulate ride completion after 1 hour
        console.log('\nSimulating ride completion...');
        const rideId = insertedRide[0].id;
        const endLocation = 'Juhu Beach';
        const totalCost = 200.00; // Example cost in rupees

        const updatedRide = await updateRideResults(rideId, endLocation, totalCost);
        if (updatedRide) {
            console.log('Ride completed successfully:', updatedRide);
        }

        // Query all rides to show the completed ride
        console.log('\nQuerying all rides...');
        const { data: rides, error: ridesQueryError } = await supabase
            .from('rides')
            .select('*, users!inner(*)');

        if (ridesQueryError) {
            console.error('Error querying rides:', ridesQueryError.message);
            return;
        }

        console.log('Rides in database:', rides);
        console.log('\nDatabase test completed successfully!');

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testDatabase(); 
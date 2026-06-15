// Initialize Supabase client
const supabaseUrl = 'https://wznborfuiedewuzvaafa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bmJvcmZ1aWVkZXd1enZhYWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjQ5MTYsImV4cCI6MjA2MDA0MDkxNn0.c3Z7b8XvHFa9tDs5r5iiclDyrBZVSGkXGamOK5oGExc';

// Create Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Export the supabase client
window.supabase = supabaseClient;

// User Management
async function createOrUpdateUser(userData) {
    const { data: existingUser, error: findError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding user:', findError.message);
        return null;
    }

    if (existingUser) {
        // Update existing user
        const { data, error } = await supabaseClient
            .from('users')
            .update({
                full_name: userData.name,
                phone_number: userData.phone
            })
            .eq('id', existingUser.id)
            .select();

        if (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
        return data[0];
    } else {
        // Create new user
        const { data, error } = await supabaseClient
            .from('users')
            .insert([{
                email: userData.email,
                full_name: userData.name,
                phone_number: userData.phone,
                password_hash: 'temporary_hash' // In production, use proper password hashing
            }])
            .select();

        if (error) {
            console.error('Error creating user:', error.message);
            return null;
        }
        return data[0];
    }
}

// Ride Management
async function createRide(rideData) {
    const { data, error } = await supabaseClient
        .from('rides')
        .insert([{
            user_id: rideData.userId,
            bike_id: rideData.bikeId,
            start_time: rideData.startTime,
            start_location: rideData.startLocation,
            status: 'active'
        }])
        .select();

    if (error) {
        console.error('Error creating ride:', error.message);
        return null;
    }
    return data[0];
}

async function completeRide(rideId, endLocation, totalCost) {
    const { data, error } = await supabaseClient
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
        console.error('Error completing ride:', error.message);
        return null;
    }
    return data[0];
}

// Booking Management
async function handleBooking(formData, cartItems) {
    try {
        // 1. Create or update user
        const user = await createOrUpdateUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        });

        if (!user) {
            throw new Error('Failed to create/update user');
        }

        // 2. Create rides for each bike in cart
        const rides = [];
        for (const bike of cartItems) {
            const ride = await createRide({
                userId: user.id,
                bikeId: bike.id.toString(),
                startTime: formData.startTime || new Date().toISOString(),
                startLocation: formData.city
            });
            if (ride) {
                rides.push(ride);
            }
        }

        return {
            success: true,
            user,
            rides
        };
    } catch (error) {
        console.error('Error handling booking:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export functions for use in other files
window.supabaseClient = {
    createOrUpdateUser,
    createRide,
    completeRide,
    handleBooking
}; 
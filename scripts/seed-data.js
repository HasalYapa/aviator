// This script can be used to seed the database with initial data
// Run with: node scripts/seed-data.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate random multiplier with realistic distribution
 */
function generateRandomMultiplier() {
  // Base value between 1.0 and 2.0 (common range)
  let multiplier = 1.0 + Math.random();
  
  // 30% chance to add more to get into 2.0-3.0 range
  if (Math.random() < 0.3) {
    multiplier += Math.random();
  }
  
  // 10% chance to get a higher value (3.0-10.0)
  if (Math.random() < 0.1) {
    multiplier += Math.random() * 7;
  }
  
  // 2% chance to get a very high value (10.0-20.0)
  if (Math.random() < 0.02) {
    multiplier += 10 + Math.random() * 10;
  }
  
  // Round to 2 decimal places
  return Math.round(multiplier * 100) / 100;
}

/**
 * Generate historical rounds data
 */
async function seedRounds(count = 100) {
  console.log(`Seeding ${count} rounds...`);
  
  const now = new Date();
  const rounds = [];
  
  for (let i = 0; i < count; i++) {
    // Games are roughly 30 seconds apart
    const timestamp = new Date(now.getTime() - (count - i) * 30000);
    
    rounds.push({
      multiplier: generateRandomMultiplier(),
      timestamp: timestamp.toISOString()
    });
  }
  
  const { data, error } = await supabase
    .from('rounds')
    .insert(rounds);
  
  if (error) {
    console.error('Error seeding rounds:', error);
    return false;
  }
  
  console.log(`Successfully seeded ${count} rounds`);
  return true;
}

/**
 * Generate predictions based on rounds
 */
async function seedPredictions(count = 20) {
  console.log(`Seeding ${count} predictions...`);
  
  // Get the most recent rounds
  const { data: rounds, error: roundsError } = await supabase
    .from('rounds')
    .select('id')
    .order('timestamp', { ascending: false })
    .limit(count);
  
  if (roundsError) {
    console.error('Error fetching rounds for predictions:', roundsError);
    return false;
  }
  
  const predictions = [];
  
  for (const round of rounds) {
    const confidence = 50 + Math.floor(Math.random() * 40); // 50-90%
    const predictedMultiplier = generateRandomMultiplier();
    const resultStatus = Math.random() > 0.3 ? 'success' : 'fail'; // 70% success rate
    
    predictions.push({
      round_id: round.id,
      predicted_multiplier: predictedMultiplier,
      confidence,
      result_status: resultStatus
    });
  }
  
  const { data, error } = await supabase
    .from('predictions')
    .insert(predictions);
  
  if (error) {
    console.error('Error seeding predictions:', error);
    return false;
  }
  
  console.log(`Successfully seeded ${count} predictions`);
  return true;
}

/**
 * Main function to seed all data
 */
async function seedAll() {
  console.log('Starting database seeding...');
  
  // Seed rounds
  const roundsSuccess = await seedRounds(100);
  
  if (roundsSuccess) {
    // Seed predictions
    await seedPredictions(20);
  }
  
  console.log('Database seeding completed');
}

// Run the seeding
seedAll().catch(console.error);

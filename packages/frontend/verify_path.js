
const componentPath = './senior/FeatureFlags';
const path = componentPath.replace('./', '');
const fullPath = `../challenges/${path}.tsx`;
console.log(`Original: ${componentPath}`);
console.log(`Processed: ${path}`);
console.log(`Full: ${fullPath}`);

const expected = '../challenges/senior/FeatureFlags.tsx';
if (fullPath === expected) {
    console.log('MATCH');
} else {
    console.log('MISMATCH');
}

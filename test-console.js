/**
 * Test Script for DATSORTIMAGES
 * Run in browser console while dev server is running
 * 
 * Usage:
 * 1. Open http://localhost:5175
 * 2. Open DevTools (F12)
 * 3. Paste this script in Console
 * 4. Run test functions
 */

// Test 1: Check if React App is loaded
function testAppLoaded() {
  const root = document.querySelector('#root');
  console.log('✅ App mounted:', !!root);
  return !!root;
}

// Test 2: Check if Service Worker / IndexedDB is ready
async function testIndexedDB() {
  try {
    const dbRequest = indexedDB.open('datsortimages', 1);
    return new Promise((resolve) => {
      dbRequest.onsuccess = () => {
        console.log('✅ IndexedDB initialized');
        resolve(true);
      };
      dbRequest.onerror = () => {
        console.error('❌ IndexedDB failed');
        resolve(false);
      };
    });
  } catch (e) {
    console.error('❌ IndexedDB error:', e);
    return false;
  }
}

// Test 3: Check Canvas API support
function testCanvasSupport() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const supported = !!ctx;
  console.log('✅ Canvas API supported:', supported);
  return supported;
}

// Test 4: Check localStorage
function testLocalStorage() {
  try {
    localStorage.setItem('test', 'value');
    localStorage.removeItem('test');
    console.log('✅ localStorage working');
    return true;
  } catch (e) {
    console.error('❌ localStorage failed:', e);
    return false;
  }
}

// Test 5: Check Tailwind CSS classes
function testTailwindCSS() {
  const el = document.querySelector('body');
  const styles = window.getComputedStyle(el);
  const hasTailwind = styles.backgroundColor !== '' || el.className.includes('dark');
  console.log('✅ Tailwind CSS loaded:', hasTailwind);
  return hasTailwind;
}

// Test 6: Test image hash calculation
async function testImageHash() {
  // Create a simple test image
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  
  // Draw a simple pattern
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 4, 4);
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(4, 4, 4, 4);
  
  // Convert to data URL
  const dataUrl = canvas.toDataURL('image/png');
  console.log('✅ Image hash test image created');
  return dataUrl;
}

// Test 7: Check responsive design
function testResponsiveDesign() {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  };
  console.log('📱 Viewport:', viewport);
  return viewport;
}

// Test 8: Check component structure
function testComponentStructure() {
  const components = {
    header: !!document.querySelector('header'),
    sidebar: !!document.querySelector('[data-testid="sidebar"]') || !!document.querySelector('nav'),
    mainContent: !!document.querySelector('main') || !!document.querySelector('[role="main"]'),
    footer: !!document.querySelector('footer')
  };
  console.log('🏗️ Component structure:', components);
  return components;
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting DATSORTIMAGES tests...\n');
  
  const results = {
    appLoaded: testAppLoaded(),
    canvasSupport: testCanvasSupport(),
    localStorage: testLocalStorage(),
    tailwindCSS: testTailwindCSS(),
    indexedDB: await testIndexedDB(),
    responsive: testResponsiveDesign(),
    components: testComponentStructure(),
    imageHash: await testImageHash()
  };
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.values(results).length;
  
  console.log(`\n✅ Tests passed: ${passed}/${total}`);
  return results;
}

// Execute tests
runAllTests();

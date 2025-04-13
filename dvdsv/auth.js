import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    db,
    doc,
    setDoc,
    getDoc
  } from './firebase.js';
  
  let isRegister = new URLSearchParams(window.location.search).get('type') === 'register';
  let selectedRole = null;
  
  // Initialize auth UI
  function initializeAuth() {
    document.getElementById('formTitle').textContent = isRegister ? 'Sign Up' : 'Sign In';
    document.getElementById('switchLink').textContent = isRegister ? 'Sign In' : 'Sign Up';
    document.getElementById('switchText').textContent = isRegister ? 
      'Already have an account? ' : 'Don\'t have an account? ';
    
    if(isRegister) {
      document.getElementById('roleSelection').classList.add('active');
    }
    
    document.getElementById('submitBtn').textContent = isRegister ? 'Sign Up' : 'Sign In';
    document.getElementById('submitBtn').onclick = isRegister ? handleRegister : handleLogin;
    document.getElementById('switchLink').onclick = switchMode;
  }
  
  // Handle role selection
  function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-option').forEach(opt => 
      opt.classList.remove('selected'));
    event.target.classList.add('selected');
    document.getElementById('businessNameField').style.display = 
      role === 'seller' ? 'block' : 'none';
  }
  
  // Switch between login/register
  function switchMode() {
    isRegister = !isRegister;
    window.history.replaceState({}, '', `auth.html?type=${isRegister ? 'register' : 'login'}`);
    initializeAuth();
    selectedRole = null;
    document.getElementById('authForm').reset();
  }
  
  // Handle registration
  async function handleRegister() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const businessName = selectedRole === 'seller' ? document.getElementById('businessName').value : null;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: selectedRole,
        ...(selectedRole === 'seller' && { businessName }),
        createdAt: new Date()
      });
      
      window.location.href = 'index.html';
    } catch (error) {
      alert(error.message);
    }
  }
  
  // Handle login
  async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'index.html';
    } catch (error) {
      alert(error.message);
    }
  }
  
  // Toggle password visibility
  window.togglePassword = function() {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
  
  // Initialize when page loads
  document.addEventListener('DOMContentLoaded', initializeAuth);
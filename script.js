// Inicialización del "database.txt" simulado en localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Crear usuarios predeterminados si no existen
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { username: 'admin', email: 'admin@tournament.com', password: 'admin123' },
            { username: 'user1', email: 'user1@example.com', password: 'password1' },
            { username: 'user2', email: 'user2@example.com', password: 'password2' },
            { username: 'player01', email: 'player01@gmail.com', password: 'gaming123' },
            { username: 'proplayer', email: 'proplayer@hotmail.com', password: 'secure456' },
            { username: 'gamerking', email: 'gamerking@yahoo.com', password: 'champion789' },
            { username: 'esports_fan', email: 'esports_fan@outlook.com', password: 'fan2023' },
            { username: 'tournament_master', email: 'tournament_master@gmail.com', password: 'master2025' }
        ];
        
        // Guardar en localStorage (equivalente a database.txt)
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Configurar navegación y eventos
    setupEventListeners();
});

// Gestión de la navegación entre páginas
function setupEventListeners() {
    // Referencias a las páginas
    const loginPage = document.getElementById('loginPage');
    const homePage = document.getElementById('homePage');
    const bracketsPage = document.getElementById('bracketsPage');
    
    // Referencias a los formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Referencias a elementos de navegación
    const registerLink = document.getElementById('registerLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const logoutBtns = [document.getElementById('logoutBtn'), document.getElementById('logoutBtn2')];
    
    // Referencias a contenedores
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.getElementById('registerContainer');
    
    // Referencias a enlaces de navegación
    const homeLinks = [document.getElementById('homeLink'), document.getElementById('homeLink2')];
    const bracketsLinks = [document.getElementById('bracketsLink'), document.getElementById('bracketsLink2')];
    const tournamentsLinks = [document.getElementById('tournamentsLink'), document.getElementById('tournamentsLink2')];
    const contactLinks = [document.getElementById('contactLink'), document.getElementById('contactLink2')];
    
    // Verificar si hay una sesión activa
    checkSession();
    
    // Evento para mostrar el formulario de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });
    
    // Evento para volver al formulario de login
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });
    
    // Evento de envío del formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        
        // Verificar credenciales contra la "base de datos"
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
        
        if (user) {
            // Guardar sesión del usuario
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email
            }));
            
            // Redirigir a la página de inicio
            showPage('home');
            
            // Actualizar la interfaz con el nombre de usuario
            updateUserInterface();
        } else {
            errorMessage.textContent = "Usuario o contraseña incorrectos. Inténtalo de nuevo.";
        }
    });
    
    // Evento de envío del formulario de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const registerMessage = document.getElementById('register-message');
        
        // Validaciones básicas
        if (password !== confirmPassword) {
            registerMessage.textContent = "Las contraseñas no coinciden";
            return;
        }
        
        // Obtener usuarios existentes
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si el usuario o email ya existe
        if (users.some(u => u.username === username)) {
            registerMessage.textContent = "Este nombre de usuario ya está en uso";
            return;
        }
        
        if (users.some(u => u.email === email)) {
            registerMessage.textContent = "Este email ya está registrado";
            return;
        }
        
        // Agregar nuevo usuario
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Actualizar el archivo database.txt simulado
        updateDatabaseFile(users);
        
        // Mensaje de éxito
        registerMessage.style.color = "#4caf50";
        registerMessage.textContent = "¡Registro exitoso! Puedes iniciar sesión ahora.";
        
        // Limpiar el formulario
        registerForm.reset();
        
        // Volver al formulario de login después de 2 segundos
        setTimeout(() => {
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            registerMessage.textContent = "";
        }, 2000);
    });
    
    // Eventos para los botones de logout
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                showPage('login');
            });
        }
    });
    
    // Eventos para los enlaces de navegación
    homeLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('home');
            });
        }
    });
    
    bracketsLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('brackets');
            });
        }
    });
    
    // Eventos para tournaments y contact links
    tournamentsLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('home');
                // Como no hay página específica de torneos, simplemente mostramos la home
                alert('Estás en la página de torneos (actualmente muestra la página principal)');
            });
        }
    });
    
    contactLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert('¡Gracias por tu interés! Puedes contactarnos en info@tournamentgamer.com');
            });
        }
    });
    
    // Eventos para botones "JOIN NOW"
    const joinButtons = document.querySelectorAll('.join-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!sessionStorage.getItem('currentUser')) {
                alert('Debes iniciar sesión para unirte a los torneos');
                showPage('login');
            } else {
                const tournamentName = this.closest('.tournament-info')?.querySelector('.tournament-title')?.textContent || 
                                      this.closest('.tournament-item-info')?.querySelector('.tournament-item-title')?.textContent || 
                                      'este torneo';
                alert(`¡Te has unido con éxito a ${tournamentName}!`);
            }
        });
    });
    
    // Configurar el temporizador de cuenta regresiva
    setupCountdown();
}

// Función para actualizar el archivo database.txt simulado
function updateDatabaseFile(users) {
    let databaseContent = "username,email,password\n";
    users.forEach(user => {
        databaseContent += `${user.username},${user.email},${user.password}\n`;
    });
    
    // Aquí podrías implementar una petición AJAX para guardar esto en un archivo real
    // en un entorno de servidor
}

// Función para mostrar una página específica
function showPage(page) {
    const pages = {
        'login': document.getElementById('loginPage'),
        'home': document.getElementById('homePage'),
        'brackets': document.getElementById('bracketsPage')
    };
    
    // Ocultar todas las páginas
    for (const key in pages) {
        if (pages[key]) pages[key].style.display = 'none';
    }
    
    // Mostrar la página seleccionada
    if (pages[page]) {
        pages[page].style.display = 'block';
        
        // Si no es la página de login, verificar sesión
        if (page !== 'login' && !sessionStorage.getItem('currentUser')) {
            showPage('login');
            document.getElementById('error-message').textContent = "Debes iniciar sesión para acceder a esta página";
            return;
        }
    }
}

// Función para verificar si hay una sesión activa
function checkSession() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (currentUser) {
        // Si hay una sesión activa, redirigir a la página de inicio
        showPage('home');
        updateUserInterface();
    } else {
        // Si no hay sesión activa, mostrar la página de login
        showPage('login');
    }
}

// Función para actualizar la interfaz con el nombre de usuario
function updateUserInterface() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        const welcomeElements = [
            document.getElementById('welcomeUser'), 
            document.getElementById('welcomeUser2')
        ];
        
        welcomeElements.forEach(element => {
            if (element) {
                element.textContent = `Bienvenido, ${currentUser.username}!`;
            }
        });
    }
}

// Función para configurar la cuenta regresiva
function setupCountdown() {
    // Fecha objetivo para el próximo torneo (24 horas a partir de ahora como ejemplo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    
    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        // Si la fecha objetivo ya pasó, detener el contador
        if (diff <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        
        // Calcular horas, minutos y segundos restantes
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Actualizar los elementos de la cuenta regresiva
        const timeBlocks = document.querySelectorAll('.time-block');
        if (timeBlocks.length >= 4) {
            timeBlocks[0].textContent = Math.floor(hours / 10);
            timeBlocks[1].textContent = hours % 10;
            timeBlocks[2].textContent = Math.floor(minutes / 10);
            timeBlocks[3].textContent = minutes % 10;
        }
    }
    
    // Actualizar el contador inmediatamente
    updateCountdown();
}

// Iniciar la aplicación cuando se cargue completamente el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkSession();
    });
} else {
    checkSession();
}

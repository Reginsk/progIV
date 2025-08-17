document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  let nome = localStorage.getItem('userName');
  
  if (!nome) {
    nome = prompt("Qual é o seu nome?");
    if (nome) {
      localStorage.setItem('userName', nome);
    }
  }
  
  if (nome) {
    document.getElementById("nome-usuario").innerText = nome;
    showWelcomeMessage(nome);
  }

  initSkillsChart();

  setupContactForm();

  setupScrollEffects();

  setupNavigation();
}

function showWelcomeMessage(nome) {
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'welcome-message';
  welcomeDiv.innerHTML = `
    <div class="welcome-content">
      <h3>🎉 Bem-vindo(a), ${nome}!</h3>
      <p>Obrigado por visitar meu currículo online!</p>
      <button onclick="this.parentElement.parentElement.remove()" class="close-btn">✕</button>
    </div>
  `;
  
  welcomeDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideInRight 0.5s ease;
    max-width: 300px;
  `;
  
  welcomeDiv.querySelector('.welcome-content').style.cssText = `
    position: relative;
  `;
  
  welcomeDiv.querySelector('.close-btn').style.cssText = `
    position: absolute;
    top: -10px;
    right: -10px;
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
  `;
  
  document.body.appendChild(welcomeDiv);
  
  setTimeout(() => {
    if (welcomeDiv.parentElement) {
      welcomeDiv.remove();
    }
  }, 5000);
}

function initSkillsChart() {
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  
  const skills = [
    { name: "HTML/CSS", level: 90, color: "#667eea" },
    { name: "JavaScript", level: 85, color: "#f093fb" },
    { name: "React", level: 80, color: "#764ba2" },
    { name: "Node.js", level: 75, color: "#667eea" },
    { name: "Python", level: 70, color: "#f093fb" }
  ];
  
  const barWidth = 50;
  const barSpacing = 20;
  const startX = 50;
  const startY = 250;
  const maxHeight = 150;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  skills.forEach((skill, index) => {
    const x = startX + index * (barWidth + barSpacing);
    const height = (skill.level / 100) * maxHeight;
    const y = startY - height;
    
    const gradient = ctx.createLinearGradient(x, y, x, startY);
    gradient.addColorStop(0, skill.color);
    gradient.addColorStop(1, adjustBrightness(skill.color, -20));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, height);
    
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.strokeStyle = skill.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, height);
    
    ctx.shadowColor = 'transparent';
    
    ctx.fillStyle = '#2d3748';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(skill.name, x + barWidth/2, startY + 20);
    
    ctx.fillStyle = skill.color;
    ctx.font = 'bold 14px Inter';
    ctx.fillText(skill.level + '%', x + barWidth/2, y - 10);
  });
  
  ctx.fillStyle = '#2d3748';
  ctx.font = 'bold 16px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Nível de Proficiência', canvas.width/2, 30);
}

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#",""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const telefone = formData.get('telefone');
    const mensagem = formData.get('mensagem');
    
    if (!nome || !email) {
      showNotification('Por favor, preencha os campos obrigatórios.', 'error');
      return;
    }
    
    showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
    
    form.reset();
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideInDown 0.5s ease;
    max-width: 400px;
    text-align: center;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setupScrollEffects() {
  const sections = document.querySelectorAll('.section');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });
}

function setupNavigation() {
  const menuLinks = document.querySelectorAll('.menu a');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
// Animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideInDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

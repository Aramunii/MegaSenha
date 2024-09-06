$(document).ready(function () {
  let senha = [];
  let senha_atual = [];
  let tentativas = 0;

  // Gerar senha aleatória
  for (let i = 0; i < 4; i++) {
    let aleatorio;
    do {
      aleatorio = Math.floor(Math.random() * 10);
    } while (senha.includes(aleatorio));
    senha.push(aleatorio);
  }
  console.log(senha);

  // Lidar com mudanças de entrada
  $(document).on("input", ".input-box", function () {
    const indiceEntrada = $(this).index(".input-box");
    const valorEntrada = parseInt($(this).val());

    if (isNaN(valorEntrada)) {
      $(this).val("");
    } else {
      senha_atual[indiceEntrada] = valorEntrada;
      if ($(this).val().length === 1) {
        $(".input-box").eq(indiceEntrada + 1).focus();
      }
    }
  });

  // Lidar com eventos de tecla pressionada
  $(document).on("keydown", ".input-box", function (e) {
    const indiceEntrada = $(this).index(".input-box");

    if (e.key === "Enter") {
      verificarSenha();
    } else if (e.key === "Backspace") {
      lidarComBackspace(indiceEntrada);
    }
  });

  // Configuração das partículas
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });

  function verificarSenha() {
    if (senha_atual.includes(undefined) || senha_atual.length !== 4) {
      setTimeout(() => {
        Swal.fire({
          title: 'Incompleto',
          text: 'Por favor, preencha todos os quatro dígitos',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }, 100);
      return;
    }

    let indices_corretos = 0;
    let numeros_corretos = 0;

    for (let i = 0; i < 4; i++) {
      if (senha_atual[i] === senha[i]) {
        indices_corretos++;
      }
      if (senha.includes(senha_atual[i])) {
        numeros_corretos++;
      }
    }

    tentativas++;

    if (indices_corretos === 4) {
      setTimeout(() => {
        $('.container-jogo').addClass('celebrate');
        Swal.fire({
          title: 'Correto!',
          text: `Você adivinhou a senha em ${tentativas} tentativas!`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            container: 'meu-swal'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            reiniciarJogo();
          }
        });
      }, 100);
    } else {
      atualizarFeedback(numeros_corretos, indices_corretos);
      adicionarNovaLinhaEntrada();
      $('.container-jogo').addClass('shake');
      setTimeout(() => {
        $('.container-jogo').removeClass('shake');
      }, 500);
    }
  }

  function lidarComBackspace(indiceEntrada) {
    senha_atual[indiceEntrada] = undefined;
    if ($(".input-box").eq(indiceEntrada).val() === "") {
      $(".input-box").eq(indiceEntrada - 1).focus();
    }
  }

  function atualizarFeedback(numeros_corretos, indices_corretos) {
    $('#acerto_num').text(numeros_corretos);
    $('#acerto_index').text(indices_corretos);
    console.log(`Números corretos: ${numeros_corretos}, Posições corretas: ${indices_corretos}`);
  }

  function adicionarNovaLinhaEntrada() {
    $(".input-box").prop('disabled', true).removeClass('input-box').addClass('input-box-disabled');
    const novaLinha = $(`
      <div class="container-input d-flex justify-content-center">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
      </div>
    `).hide();

    $('.container-jogo').append(novaLinha);
    novaLinha.fadeIn(500);
    
    // Limpar senha_atual para a nova linha
    senha_atual = [];

    // Rolar para a nova linha de entrada
    const containerJogo = $('.container-jogo');
    containerJogo.scrollTop(containerJogo[0].scrollHeight);
  }

  function reiniciarJogo() {
    senha = [];
    senha_atual = [];
    tentativas = 0;
    
    // Resetar o feedback
    $('#acerto_num').text('0');
    $('#acerto_index').text('0');
    
    $('.container-jogo').empty().append(`
      <div class="container-input d-flex justify-content-center">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
        <input type="text" maxlength="1" class="input-box estilo-input">
      </div>
    `);
    
    for (let i = 0; i < 4; i++) {
      let aleatorio;
      do {
        aleatorio = Math.floor(Math.random() * 10);
      } while (senha.includes(aleatorio));
      senha.push(aleatorio);
    }
    console.log(senha);
  }
});

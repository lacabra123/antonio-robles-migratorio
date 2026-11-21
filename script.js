document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '18095090054';

    /* 1. Encabezado sutil y visibilidad contextual del botón concierge de WhatsApp */
    const header = document.getElementById('site-header');
    const waConcierge = document.getElementById('whatsapp-concierge');
    const heroSection = document.getElementById('inicio');

    const actualizarScrollUI = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 24);
        }
        if (waConcierge) {
            const umbralHero = heroSection ? Math.max(heroSection.offsetHeight - 180, 320) : 360;
            waConcierge.classList.toggle('mostrar', window.scrollY > umbralHero);
        }
    };

    /* 2. Revelado sutil de secciones al hacer scroll (progresivo y accesible) */
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.documentElement.classList.add('js-ready');
    if (!prefersReducedMotion) {
        document.documentElement.classList.add('js-anim');
    }

    actualizarScrollUI();
    window.addEventListener('scroll', actualizarScrollUI, { passive: true });
    window.addEventListener('resize', actualizarScrollUI, { passive: true });

    if (revealEls.length > 0 && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.08
            }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    /* 3. Menú móvil accesible */
    const menuToggle = document.querySelector('.menu-toggle');
    const navPrincipal = document.getElementById('nav-principal');

    if (menuToggle && navPrincipal) {
        const cerrarMenu = () => {
            navPrincipal.classList.remove('abierto');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        };

        menuToggle.addEventListener('click', () => {
            const abierto = navPrincipal.classList.toggle('abierto');
            menuToggle.setAttribute('aria-expanded', String(abierto));
            menuToggle.setAttribute(
                'aria-label',
                abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        });

        navPrincipal.querySelectorAll('a').forEach((enlace) => {
            enlace.addEventListener('click', cerrarMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navPrincipal.classList.contains('abierto')) {
                cerrarMenu();
                menuToggle.focus();
            }
        });

        document.addEventListener('click', (e) => {
            if (
                navPrincipal.classList.contains('abierto') &&
                !navPrincipal.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                cerrarMenu();
            }
        });
    }

    /* 4. Indicador activo de navegación (Scroll-Spy) */
    const navLinks = Array.from(document.querySelectorAll('#nav-principal a[href^="#"]'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (navLinks.length > 0 && sections.length > 0 && 'IntersectionObserver' in window) {
        const setActiveLink = (sectionId) => {
            navLinks.forEach((link) => {
                const isMatch = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('activo', isMatch);
                if (isMatch) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        setActiveLink('inicio');

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setActiveLink(visible[0].target.id);
                }
            },
            {
                rootMargin: '-25% 0px -55% 0px',
                threshold: [0.1, 0.25, 0.5]
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    /* 5. Preselección automática de servicio desde las tarjetas */
    const selectServicio = document.getElementById('servicio');
    const inputNombre = document.getElementById('nombre');

    document.querySelectorAll('.link-servicio[data-service]').forEach((link) => {
        link.addEventListener('click', () => {
            const serviceValue = link.getAttribute('data-service');
            if (selectServicio && serviceValue) {
                selectServicio.value = serviceValue;
                selectServicio.classList.add('campo-destacado');
                window.setTimeout(() => {
                    selectServicio.classList.remove('campo-destacado');
                }, 1600);
            }

            if (inputNombre) {
                window.setTimeout(() => {
                    inputNombre.focus({ preventScroll: true });
                }, 450);
            }
        });
    });

    /* 6. Acordeón de Preguntas Frecuentes (FAQ) */
    const faqButtons = document.querySelectorAll('.faq-pregunta');

    faqButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const respuesta = item ? item.querySelector('.faq-respuesta') : null;
            const yaAbierto = btn.getAttribute('aria-expanded') === 'true';

            faqButtons.forEach((otroBtn) => {
                const otroItem = otroBtn.closest('.faq-item');
                const otraResp = otroItem ? otroItem.querySelector('.faq-respuesta') : null;
                otroBtn.setAttribute('aria-expanded', 'false');
                if (otroItem) otroItem.classList.remove('abierto');
                if (otraResp) otraResp.hidden = true;
            });

            if (!yaAbierto && respuesta) {
                btn.setAttribute('aria-expanded', 'true');
                item.classList.add('abierto');
                respuesta.hidden = false;
            }
        });
    });

    /* 7. Validación y envío sin fallos del formulario de consulta */
    const form = document.getElementById('form-consulta');
    const formError = document.getElementById('form-error');
    const formExito = document.getElementById('form-exito');
    const exitoResumen = document.getElementById('exito-resumen');
    const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
    const btnEditarConsulta = document.getElementById('btn-editar-consulta');

    if (form && formError && formExito) {
        const limpiarErrores = () => {
            formError.hidden = true;
            formError.textContent = '';
            form.querySelectorAll('.campo-invalido').forEach((el) => {
                el.classList.remove('campo-invalido');
            });
        };

        form.querySelectorAll('input, textarea, select').forEach((campo) => {
            campo.addEventListener('input', () => {
                campo.classList.remove('campo-invalido');
                if (!formError.hidden) {
                    formError.hidden = true;
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarErrores();

            const nombre = form.nombre.value.trim();
            const telefono = form.telefono.value.trim();
            const servicioTexto =
                form.servicio.options[form.servicio.selectedIndex]?.text || 'Consulta migratoria';
            const urgencia = form.urgencia ? form.urgencia.value : '';
            const modalidad = form.modalidad ? form.modalidad.value : '';
            const mensaje = form.mensaje.value.trim();

            const faltantes = [];

            if (nombre.length < 2) {
                form.nombre.classList.add('campo-invalido');
                faltantes.push('tu nombre completo');
            }

            const digitosTel = telefono.replace(/\D/g, '');
            if (digitosTel.length < 7) {
                form.telefono.classList.add('campo-invalido');
                faltantes.push('un teléfono o WhatsApp válido');
            }

            if (mensaje.length < 10) {
                form.mensaje.classList.add('campo-invalido');
                faltantes.push('una breve descripción de tu caso');
            }

            if (faltantes.length > 0) {
                const listaFaltantes =
                    faltantes.length === 1
                        ? faltantes[0]
                        : `${faltantes.slice(0, -1).join(', ')} y ${faltantes[faltantes.length - 1]}`;
                formError.textContent = `Por favor completa ${listaFaltantes} para poder evaluar tu consulta.`;
                formError.hidden = false;
                const primerInvalido = form.querySelector('.campo-invalido');
                if (primerInvalido) primerInvalido.focus();
                return;
            }

            const lineasMensaje = [
                'Hola Lic. Antonio Robles, solicito una consulta legal migratoria:',
                `• Nombre: ${nombre}`,
                `• Teléfono/WhatsApp: ${telefono}`,
                `• Trámite: ${servicioTexto}`,
                ...(urgencia ? [`• Urgencia: ${urgencia}`] : []),
                ...(modalidad ? [`• Modalidad: ${modalidad}`] : []),
                `• Detalles: ${mensaje}`
            ];

            const textoPlano = lineasMensaje.join('\n');
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoPlano)}`;

            btnEnviarWhatsapp.href = waUrl;

            exitoResumen.replaceChildren();
            const datos = [
                ['Cliente', nombre],
                ['Teléfono', telefono],
                ['Servicio', servicioTexto],
                ...(urgencia ? [['Urgencia', urgencia]] : []),
                ...(modalidad ? [['Modalidad', modalidad]] : []),
                ['Detalle', mensaje]
            ];

            datos.forEach(([etiqueta, valor]) => {
                const fila = document.createElement('div');
                const strong = document.createElement('strong');
                strong.textContent = `${etiqueta}: `;
                fila.appendChild(strong);
                fila.appendChild(document.createTextNode(valor));
                exitoResumen.appendChild(fila);
            });

            form.hidden = true;
            formExito.hidden = false;
            formExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        if (btnEditarConsulta) {
            btnEditarConsulta.addEventListener('click', () => {
                formExito.hidden = true;
                form.hidden = false;
                form.nombre.focus();
            });
        }
    }
});

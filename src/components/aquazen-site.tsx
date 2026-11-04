"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  FlaskConical,
  Menu,
  MoveHorizontal,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandMark } from "@/components/brand-mark";
import { PoolThatFillsUp } from "@/components/pool-that-fills-up";
import { galleryImages, processSteps, serviceOptions, services } from "@/data/site";
import { getSocialLinks, getWhatsAppUrl } from "@/lib/config";

const serviceIcons: Record<(typeof services)[number]["icon"], LucideIcon> = {
  sparkles: Sparkles,
  flask: FlaskConical,
  settings: ShieldCheck,
  waves: Waves,
};

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Transformação", href: "#transformacao" },
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Galeria", href: "#galeria" },
];

const socialLinks = getSocialLinks();

export function AquaZenSite() {
  const siteRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comparison, setComparison] = useState(52);
  const [formStatus, setFormStatus] = useState("");
  const [headerDark, setHeaderDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, footer"));
    let ticking = false;
    let frame = 0;

    const updateProgress = () => {
      const scrollableHeight = root.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      root.style.setProperty("--scroll-progress", `${progress}%`);
      const activeSection = sections
        .filter((section) => section.getBoundingClientRect().top <= 96)
        .at(-1);
      if (activeSection) {
        setHeaderDark(
          activeSection.matches(".pool-experience, .process, .contact, .footer"),
        );
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      frame = window.requestAnimationFrame(updateProgress);
      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frame);
      root.style.removeProperty("--scroll-progress");
    };
  }, []);

  useEffect(() => {
    const element = siteRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let context: ReturnType<typeof import("gsap").gsap.context> | undefined;

    const initializeAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((item) => {
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".parallax__media").forEach((image) => {
          gsap.to(image, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: image.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        });

        const responsiveAnimations = gsap.matchMedia();
        responsiveAnimations.add("(min-width: 761px)", () => {
          gsap.to(".process__line-fill", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".process",
              start: "top 70%",
              end: "bottom 75%",
              scrub: 0.7,
            },
          });
        });

        responsiveAnimations.add("(max-width: 760px)", () => {
          gsap.to(".process__line-fill", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".process",
              start: "top 72%",
              end: "bottom 80%",
              scrub: 0.7,
            },
          });
        });

      }, element);
    };

    void initializeAnimations();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  const handleQuoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = [
      "Olá! Gostaria de solicitar um orçamento para minha piscina.",
      "",
      `Nome: ${formData.get("name")}`,
      `Telefone: ${formData.get("phone")}`,
      `Serviço: ${formData.get("service")}`,
      `Mensagem: ${formData.get("message")}`,
    ].join("\n");
    const url = getWhatsAppUrl(message);

    if (!url) {
      setFormStatus(
        "O WhatsApp ainda não está configurado. Nenhum dado foi enviado. Configure o número oficial no arquivo .env.local.",
      );
      return;
    }

    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      setFormStatus("O navegador bloqueou a nova janela. Permita a abertura do WhatsApp e tente novamente.");
      return;
    }

    newWindow.opener = null;
    setFormStatus("Sua mensagem está pronta no WhatsApp. Revise e envie para concluir o contato.");
  };

  const handleComparisonChange = (value: number) => {
    setComparison(value);
  };

  const whatsappUrl = getWhatsAppUrl("Olá, gostaria de conversar sobre o cuidado da minha piscina.");

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" ref={siteRef}>
        <div aria-hidden="true" className="scroll-progress" />

        <header className={`site-header${headerDark ? "" : " site-header--light"}`}>
          <div className="site-header__inner page-wrap">
            <a aria-label="AquaZen Piscinas, início" className="brand" href="#inicio">
              <BrandMark className="brand__mark" />
              <span className="brand__words">
                <span className="brand__name">aquazen</span>
                <span className="brand__descriptor">PISCINAS</span>
              </span>
            </a>

            <nav aria-label="Navegação principal" className="desktop-nav">
              {navigation.map((item) => (
                <a className="desktop-nav__link" href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <a className="header-cta" href="#contato">
              Solicitar orçamento <ArrowUpRight aria-hidden="true" size={15} />
            </a>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          <motion.nav
            animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            aria-hidden={!menuOpen}
            aria-label="Navegação móvel"
            className="mobile-nav"
            id="mobile-navigation"
            initial={false}
            style={{ pointerEvents: menuOpen ? "auto" : "none" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {navigation.map((item, index) => (
              <motion.a
                animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                transition={{ delay: menuOpen ? index * 0.035 : 0, duration: 0.2 }}
              >
                {item.label} <ArrowUpRight aria-hidden="true" size={15} />
              </motion.a>
            ))}
            <a
              className="mobile-nav__cta"
              href="#contato"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              Solicitar orçamento <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </motion.nav>
        </header>

        <main>
          <PoolThatFillsUp />

          <section aria-labelledby="transformation-title" className="transformation section-pad" id="transformacao">
            <div className="page-wrap transformation__layout">
              <div className="transformation__copy reveal">
                <p className="eyebrow eyebrow--dark">Uma nova perspectiva</p>
                <h2 id="transformation-title">
                  A diferença está
                  <br />
                  <span>no cuidado.</span>
                </h2>
                <p>
                  Arraste o controle para comparar a mesma piscina nas imagens de antes e depois. As fotos são
                  referências visuais e não registram um atendimento realizado pela AquaZen.
                </p>
                <div className="transformation__hint">
                  <span className="transformation__hint-icon"><MoveHorizontal aria-hidden="true" size={18} /></span>
                  <span>Arraste para comparar</span>
                </div>
              </div>

              <div className="comparison reveal">
                <div className="comparison__viewport">
                  <Image
                    alt="Piscina residencial com água azul e cristalina, na imagem de comparação"
                    className="comparison__photo"
                    fill
                    sizes="(max-width: 900px) 100vw, 58vw"
                    src="/images/comparison-pool-after.webp"
                  />
                  <div
                    aria-hidden="true"
                    className="comparison__before"
                    style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}
                  >
                    <Image
                      alt="A mesma piscina com água esverdeada, na imagem de comparação"
                      className="comparison__photo comparison__photo--before"
                      fill
                      sizes="(max-width: 900px) 100vw, 58vw"
                      src="/images/comparison-pool-before.webp"
                    />
                  </div>
                  <span className="comparison__label comparison__label--before">Antes</span>
                  <span className="comparison__label comparison__label--after">Depois</span>
                  <span
                    aria-hidden="true"
                    className="comparison__divider"
                    style={{ left: `${comparison}%` }}
                  >
                    <span><MoveHorizontal size={17} /></span>
                  </span>
                  <input
                    aria-label="Controle para comparar as imagens da piscina antes e depois"
                    className="comparison__input"
                    max="100"
                    min="0"
                    onChange={(event) => handleComparisonChange(Number(event.currentTarget.value))}
                    type="range"
                    value={comparison}
                  />
                </div>
                <p className="comparison__caption">
                  Imagens de referência fornecidas para comparação; não representam um atendimento realizado pela AquaZen.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="services-title" className="services section-pad" id="servicos">
            <div className="page-wrap">
              <div className="section-heading reveal">
                <div>
                  <p className="eyebrow eyebrow--dark">Soluções para a sua piscina</p>
                  <h2 id="services-title">
                    Cuidado completo.
                    <br />
                    <span>Sem complicar.</span>
                  </h2>
                </div>
                <p className="section-heading__aside">
                  Da limpeza de rotina à recuperação da água, cada cuidado começa com atenção ao que a sua piscina
                  realmente precisa.
                </p>
              </div>

              <div className="service-grid">
                {services.map((service, index) => {
                  const Icon = serviceIcons[service.icon];

                  return (
                    <motion.article
                      className="service-card reveal"
                      key={service.number}
                      style={{ transitionDelay: `${index * 70}ms` }}
                      whileHover={{ y: -7 }}
                    >
                      <div className="service-card__image">
                        <Image
                          alt={service.imageAlt}
                          className="parallax__media"
                          fill
                          sizes="(max-width: 700px) 90vw, (max-width: 1040px) 44vw, 23vw"
                          src={service.image}
                        />
                        <span className="service-card__number">{service.number}</span>
                        <span aria-hidden="true" className="service-card__icon">
                          <Icon size={20} strokeWidth={1.7} />
                        </span>
                      </div>
                      <div className="service-card__copy">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <a aria-label={`Solicitar orçamento para ${service.title}`} href="#contato">
                          Vamos conversar <ArrowUpRight aria-hidden="true" size={15} />
                        </a>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>

          <section aria-labelledby="care-title" className="care section-pad" id="diferenciais">
            <div className="page-wrap care__layout">
              <div className="care__image-wrap reveal parallax">
                <Image
                  alt="Piscina de resort integrada a jardins tropicais e ao horizonte"
                  className="care__image parallax__media"
                  fill
                  sizes="(max-width: 850px) 100vw, 54vw"
                  src="/images/gallery-garden.webp"
                />
                <div className="care__image-note">
                  <Waves aria-hidden="true" size={17} />
                  <span>Cuidado que vai além da superfície</span>
                </div>
              </div>

              <div className="care__copy reveal">
                <p className="eyebrow eyebrow--dark">Mais do que água cristalina</p>
                <h2 id="care-title">
                  O essencial
                  <br />
                  <span>é o equilíbrio.</span>
                </h2>
                <p className="care__intro">
                  A AquaZen é uma equipe especializada em limpeza, tratamento e manutenção de piscinas. Olhamos para
                  a água, os equipamentos e a rotina como partes do mesmo cuidado.
                </p>
                <ul className="care-list">
                  <li><span><Check aria-hidden="true" size={15} /></span> Água acompanhada com atenção</li>
                  <li><span><Check aria-hidden="true" size={15} /></span> Equipamentos observados em cada visita</li>
                  <li><span><Check aria-hidden="true" size={15} /></span> Recomendações claras para a sua rotina</li>
                </ul>
                <a className="text-link" href="#processo">
                  Conheça nosso processo <ArrowRight aria-hidden="true" size={16} />
                </a>
              </div>
            </div>
          </section>

          <section aria-labelledby="process-title" className="process section-pad" id="processo">
            <div className="page-wrap">
              <div className="process__heading reveal">
                <p className="eyebrow">Da primeira conversa à rotina de cuidado</p>
                <h2 id="process-title">
                  Um processo simples.
                  <br />
                  <span>Um cuidado constante.</span>
                </h2>
              </div>

              <div className="process__timeline">
                <div aria-hidden="true" className="process__line">
                  <span className="process__line-fill" />
                </div>
                <div className="process__steps">
                  {processSteps.map((step) => (
                    <article className="process-step reveal" key={step.number}>
                      <span className="process-step__marker">{step.number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <p className="process__note reveal">
                Cada piscina tem suas particularidades. As etapas podem variar conforme a avaliação.
              </p>
            </div>
          </section>

          <section aria-labelledby="gallery-title" className="gallery section-pad" id="galeria">
            <div className="page-wrap">
              <div className="gallery__heading reveal">
                <div>
                  <p className="eyebrow eyebrow--dark">Água, luz e arquitetura</p>
                  <h2 id="gallery-title">
                    Espaços feitos
                    <br />
                    <span>para aproveitar.</span>
                  </h2>
                </div>
                <p>Uma seleção de referências visuais para imaginar novos momentos ao redor da piscina.</p>
              </div>
              <div className="gallery-grid">
                {galleryImages.map((item, index) => (
                  <figure className={`gallery-card gallery-card--${index + 1} reveal`} key={item.title}>
                    <div className="gallery-card__image parallax">
                      <Image
                        alt={item.imageAlt}
                        className="parallax__media"
                        fill
                        sizes="(max-width: 700px) 90vw, (max-width: 1000px) 48vw, 34vw"
                        src={item.image}
                      />
                    </div>
                    <figcaption>
                      <span>{item.title}</span>
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="contact-title" className="contact" id="contato">
            <Image
              alt="Piscina de águas claras diante de uma casa de madeira, ao ar livre"
              className="contact__photo"
              fill
              sizes="100vw"
              src="/images/contact-pool.webp"
            />
            <div aria-hidden="true" className="contact__shade" />
            <div className="page-wrap contact__layout">
              <div className="contact__intro reveal">
                <p className="eyebrow">O próximo mergulho começa aqui</p>
                <h2 id="contact-title">
                  Sua piscina em
                  <br />
                  perfeito <span>equilíbrio.</span>
                </h2>
                <p>Conte o que você precisa. Vamos conversar sobre o melhor cuidado para a sua piscina.</p>
                <a
                  className="button button--primary contact__whatsapp"
                  href={whatsappUrl ?? "#orcamento"}
                  rel={whatsappUrl ? "noreferrer" : undefined}
                  target={whatsappUrl ? "_blank" : undefined}
                >
                  {whatsappUrl ? "Falar pelo WhatsApp" : "Solicitar orçamento"}{" "}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
                {!whatsappUrl && (
                  <p className="contact__setup">
                    Para habilitar o WhatsApp, configure o número oficial em <code>.env.local</code>.
                  </p>
                )}
              </div>

              <form className="quote-form reveal" id="orcamento" onSubmit={handleQuoteSubmit}>
                <div className="quote-form__heading">
                  <span className="eyebrow">Vamos começar?</span>
                  <h3>Solicite seu orçamento</h3>
                </div>
                <label htmlFor="quote-name">Seu nome</label>
                <input autoComplete="name" id="quote-name" name="name" placeholder="Como podemos chamar você?" required />
                <div className="quote-form__row">
                  <div>
                    <label htmlFor="quote-phone">Telefone</label>
                    <input
                      autoComplete="tel"
                      id="quote-phone"
                      name="phone"
                      placeholder="DDD + número"
                      required
                      type="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-service">Serviço</label>
                    <div className="select-wrap">
                      <select defaultValue="" id="quote-service" name="service" required>
                        <option disabled value="">Selecione</option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" size={16} />
                    </div>
                  </div>
                </div>
                <label htmlFor="quote-message">Como podemos ajudar?</label>
                <textarea
                  id="quote-message"
                  name="message"
                  placeholder="Conte um pouco sobre sua piscina e o que procura."
                  required
                  rows={3}
                />
                <button className="button button--primary quote-form__submit" type="submit">
                  {whatsappUrl ? "Continuar pelo WhatsApp" : "Ver instruções de contato"}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </button>
                <p className="quote-form__privacy">
                  <ShieldCheck aria-hidden="true" size={14} />
                  Seus dados são usados somente para preparar a solicitação.
                </p>
                <p aria-live="polite" className="quote-form__status" role="status">{formStatus}</p>
              </form>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="page-wrap footer__main">
            <div className="footer__brand">
              <a aria-label="AquaZen Piscinas, voltar ao início" className="brand brand--footer" href="#inicio">
                <BrandMark className="brand__mark" />
                <span className="brand__words">
                  <span className="brand__name">aquazen</span>
                  <span className="brand__descriptor">PISCINAS</span>
                </span>
              </a>
              <p>Sua piscina em perfeito equilíbrio.</p>
            </div>

            <nav aria-label="Navegação do rodapé" className="footer__column">
              <span className="footer__label">Explore</span>
              <a href="#servicos">Serviços</a>
              <a href="#processo">Nosso processo</a>
              <a href="#galeria">Galeria</a>
            </nav>

            <div className="footer__column">
              <span className="footer__label">Atendimento</span>
              <a href="#contato">Solicitar orçamento</a>
              <a href="#transformacao">Como cuidamos</a>
            </div>

            <div className="footer__column footer__socials">
              <span className="footer__label">Redes sociais</span>
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <a href={social.href} key={social.name} rel="noreferrer" target="_blank">
                    {social.name} <ArrowUpRight aria-hidden="true" size={13} />
                  </a>
                ))
              ) : (
                <p>Os perfis oficiais serão adicionados aqui.</p>
              )}
            </div>

            <a aria-label="Voltar ao início da página" className="footer__top" href="#inicio">
              <ArrowUp aria-hidden="true" size={16} />
            </a>
          </div>
          <div className="page-wrap footer__bottom">
            <span>© {new Date().getFullYear()} AquaZen Piscinas.</span>
            <span>Um conceito de cuidado para a sua piscina.</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

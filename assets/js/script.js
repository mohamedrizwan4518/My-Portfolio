// Helper: throttle
function throttle (fn, wait) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
  }
}

// =============== THEME TOGGLE ===============
const THEME_KEY = 'mr-theme'
const themeToggle = document.getElementById('theme-toggle')

function applyTheme (mode) {
  const isLight = mode === 'light'
  document.body.classList.toggle('theme-light', isLight)
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-icon')
    const label = themeToggle.querySelector('.theme-label')
    if (icon) icon.textContent = isLight ? '☀️' : '🌙'
    if (label) label.textContent = isLight ? 'Light' : 'Dark'
  }
}

;(function initTheme () {
  const stored = localStorage.getItem(THEME_KEY)
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const initial = stored || (prefersDark ? 'dark' : 'light')
  applyTheme(initial)
})()

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('theme-light')
    const next = isLight ? 'dark' : 'light'
    applyTheme(next)
    localStorage.setItem(THEME_KEY, next)
  })
}

// =============== AOS INITIALIZATION ===============
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  })
}

/* =============== BACKGROUND STARFIELD (FIXED) =============== */

const bgCanvas = document.getElementById('bg-canvas')

if (bgCanvas && bgCanvas.getContext) {
  const ctx = bgCanvas.getContext('2d')

  let stars = []
  let w = 0
  let h = 0

  const resize = () => {
    w = bgCanvas.width = window.innerWidth
    h = bgCanvas.height = window.innerHeight

    const count = Math.round((w * h) / 12000)

    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.2 + Math.random() * 0.8,
      r: 0.5 + Math.random() * 1.2
    }))
  }

  window.addEventListener('resize', resize)
  resize()

  const loopStars = () => {
    ctx.clearRect(0, 0, w, h)

    const light = document.body.classList.contains('theme-light')

    stars.forEach(s => {
      /* MOVEMENT */
      if (light) {
        s.y += 0.05 + s.z * 0.2
        s.x += Math.sin(s.y * 0.01) * 0.3
      } else {
        s.y += 0.1 + s.z * 0.6
      }

      /* RESET */
      if (s.y > h + 20) {
        s.y = -10
        s.x = Math.random() * w
      }

      ctx.beginPath()

      /* COLOR */
      let color

      if (light) {
        const colors = [
          `rgba(37,99,235,${0.25 + Math.random() * 0.3})`,
          `rgba(147,51,234,${0.25 + Math.random() * 0.3})`,
          `rgba(34,197,94,${0.2 + Math.random() * 0.25})`
        ]
        color = colors[Math.floor(Math.random() * colors.length)]
      } else {
        const alpha = 0.6 + Math.random() * 0.4
        color = `rgba(226,232,240,${alpha})`
      }

      ctx.fillStyle = color

      ctx.arc(s.x, s.y, s.r * (light ? 0.9 : 1.1), 0, Math.PI * 2)
      ctx.fill()
    })

    requestAnimationFrame(loopStars)
  }

  loopStars()
}

// =============== PRELOADER ===============
const preloader = document.getElementById('preloader')
const preBar = document.getElementById('pre-bar')
const prePct = document.getElementById('pre-pct')

if (preloader && preBar && prePct) {
  let pct = 0
  const step = () => {
    pct += Math.random() * 18
    if (pct > 96) pct = 96
    preBar.style.width = pct + '%'
    prePct.textContent = Math.round(pct) + '%'
  }
  const timer = setInterval(step, 140)

  window.addEventListener('load', () => {
    clearInterval(timer)
    preBar.style.width = '100%'
    prePct.textContent = '100%'
    setTimeout(() => {
      preloader.classList.add('hidden')
    }, 280)
  })
}

// =============== TIME IN NAVBAR ===============
const navTimeEl = document.getElementById('nav-time')
if (navTimeEl) {
  const updateTime = () => {
    const d = new Date()
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    navTimeEl.textContent = `${h}:${m} IST`
  }
  updateTime()
  setInterval(updateTime, 60000)
}

// =============== CUSTOM CURSOR ===============
const cursorDot = document.getElementById('cursor-dot')
const cursorRing = document.getElementById('cursor-ring')

if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let tx = x
  let ty = y

  const move = e => {
    x = e.clientX
    y = e.clientY
    cursorDot.style.opacity = '1'
    cursorRing.style.opacity = '1'
  }

  window.addEventListener('mousemove', move)

  const render = () => {
    tx += (x - tx) * 0.18
    ty += (y - ty) * 0.18
    cursorDot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    cursorRing.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
    requestAnimationFrame(render)
  }
  render()
}

// =============== SCROLL PROGRESS ===============
const scrollBar = document.getElementById('scroll-bar')
if (scrollBar) {
  const updateScroll = throttle(() => {
    const h = document.documentElement
    const max = h.scrollHeight - h.clientHeight
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0
    scrollBar.style.width = pct + '%'
  }, 40)

  window.addEventListener('scroll', updateScroll, { passive: true })
  updateScroll()
}

// =============== NAVBAR SCROLL STATE ===============
const navbar = document.getElementById('navbar')
if (navbar) {
  const handleNavScroll = throttle(() => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }, 80)
  window.addEventListener('scroll', handleNavScroll, { passive: true })
  handleNavScroll()
}

// =============== MOBILE NAV ===============
const burger = document.getElementById('burger')
const mobMenu = document.getElementById('mob-menu')

if (burger && mobMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open')
    mobMenu.classList.toggle('open')
  })

  mobMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open')
      mobMenu.classList.remove('open')
    })
  })
}

// =============== SMOOTH SCROLL FOR LINKS ===============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    const y = target.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top: y, behavior: 'smooth' })
  })
})

// =============== TYPED ROLE TEXT ===============
const typedEl = document.getElementById('typed-role')
if (typedEl) {
  const roles = [
    'AI & Full Stack Developer',
    'Python Developer',
    'IoT Innovator',
    'Problem Solver',
    'Machine Learning Enthusiast',
    'UI Path RPA Developer',
    'Data Science Enthusiast'
  ]
  let idx = 0
  let char = 0
  let deleting = false

  const tick = () => {
    const current = roles[idx]
    if (!deleting) {
      char++
      if (char >= current.length) {
        char = current.length
        deleting = true
        setTimeout(tick, 1500)
        typedEl.textContent = current.slice(0, char)
        return
      }
    } else {
      char--
      if (char <= 0) {
        char = 0
        deleting = false
        idx = (idx + 1) % roles.length
      }
    }
    typedEl.textContent = current.slice(0, char)
    setTimeout(tick, deleting ? 40 : 80)
  }

  setTimeout(tick, 800)
}

const statEls = document.querySelectorAll('.hs-n[data-count]')

statEls.forEach(el => {
  const target = parseInt(el.dataset.count)
  let val = 0

  const update = () => {
    val++

    el.textContent = val

    if (val < target) {
      requestAnimationFrame(update)
    }
  }

  update()
})

// =============== SIMPLE AOS-LIKE SCROLL REVEAL ===============
const aosEls = document.querySelectorAll('[data-aos]')
if (aosEls.length) {
  const reveal = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      }
    })
  }

  const delayMap = new WeakMap()
  aosEls.forEach(el => {
    const d = parseInt(el.getAttribute('data-delay') || '0', 10)
    if (d) delayMap.set(el, d)
  })

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          const d = delayMap.get(el) || 0
          if (d) {
            setTimeout(() => {
              reveal([entry], observer)
            }, d)
          } else {
            reveal([entry], observer)
          }
        }
      })
    },
    { threshold: 0.15 }
  )

  aosEls.forEach(el => obs.observe(el))
}

// =============== PROJECT FILTER ===============
const projButtons = document.querySelectorAll('.pf-btn')
const projCards = document.querySelectorAll('.stack-card')

if (projButtons.length && projCards.length) {
  projButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter || 'all'
      projButtons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      projCards.forEach(card => {
        const c = card.dataset.cat || 'all'
        if (cat === 'all' || c === cat) {
          card.classList.remove('hidden')
        } else {
          card.classList.add('hidden')
        }
      })
    })
  })
}

// =============== RESUME TABS ===============
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.rx-tab')
  const groups = document.querySelectorAll('.rx-group')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // remove active
      tabs.forEach(t => t.classList.remove('active'))
      groups.forEach(g => g.classList.remove('active'))

      // add active
      tab.classList.add('active')

      const target = tab.dataset.tab
      document.getElementById(target).classList.add('active')
    })
  })
})

document.querySelectorAll('.rx-item').forEach(item => {
  item.addEventListener('click', () => {
    // remove old active
    document
      .querySelectorAll('.rx-item')
      .forEach(i => i.classList.remove('active'))

    // trigger new
    item.classList.add('active')

    // restart animation (important)
    void item.offsetWidth
  })
})

// =============== SKILL BARS ANIMATION ===============
const skillFills = document.querySelectorAll('.sbi-fill')
if (skillFills.length) {
  const animateSkills = () => {
    skillFills.forEach(el => {
      const w = el.getAttribute('data-w') || '0'
      el.style.width = w + '%'
      el.style.transition = 'width 1s ease-out'
    })
  }

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkills()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.3 }
  )

  const skillsSection = document.getElementById('skills')
  if (skillsSection) obs.observe(skillsSection)
}

// =============== CONTACT FORM ===============
const contactForm = document.getElementById('contact-form')
if (contactForm) {
  const ok = document.getElementById('form-ok')
  contactForm.addEventListener('submit', e => {
    e.preventDefault()
    if (ok) {
      ok.style.display = 'block'
    }
    contactForm.reset()
  })
}

// =============== BACK TO TOP ===============
const backTop = document.getElementById('back-top')
if (backTop) {
  backTop.addEventListener('click', e => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

/* ═════════ ULTIMATE SKILLS JS (CLEAN) ═════════ */

const cards = document.querySelectorAll('.skill-item')

cards.forEach(card => {
  const inner = card.querySelector('.skill-inner')

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    /* 🎮 3D TILT */
    const rotateX = -(y - centerY) / 12
    const rotateY = (x - centerX) / 12

    inner.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `

    /* 💡 SPOTLIGHT */
    inner.style.setProperty('--x', `${x}px`)
    inner.style.setProperty('--y', `${y}px`)
  })

  /* RESET */
  card.addEventListener('mouseleave', () => {
    inner.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
  })
})

/* ===== CUSTOM SELECT ===== */
const select = document.querySelector('.custom-select')
const display = select?.querySelector('.select-display')
const options = select?.querySelectorAll('.option')

if (display) {
  display.addEventListener('click', () => {
    select.classList.toggle('active')
  })

  options.forEach(option => {
    option.addEventListener('click', () => {
      display.textContent = option.textContent

      options.forEach(o => o.classList.remove('selected'))
      option.classList.add('selected')

      select.classList.remove('active')
    })
  })

  document.addEventListener('click', e => {
    if (!select.contains(e.target)) {
      select.classList.remove('active')
    }
  })
}

/* ===== BUTTON MAGNET EFFECT ===== */
const btn = document.querySelector('.btn-send')

if (btn) {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
  })

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)'
  })
}

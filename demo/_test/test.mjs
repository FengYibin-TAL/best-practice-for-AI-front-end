import { chromium } from 'playwright'

const URL = process.env.URL || 'http://localhost:4173/'
const errors = []
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

const ok = [], fail = []
const check = (name, cond) => { (cond ? ok : fail).push(name); console.log((cond ? '✅' : '❌') + ' ' + name) }

const dragFirstToSlot = async (slotIdx) => {
  const piece = page.locator('.drag-piece').first()
  const slot = page.locator('.drag-slot').nth(slotIdx)
  const p = await piece.boundingBox()
  const s = await slot.boundingBox()
  await page.mouse.move(p.x + p.width / 2, p.y + p.height / 2)
  await page.mouse.down()
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2, { steps: 15 })
  await page.mouse.up()
  await page.waitForTimeout(130)
}

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(300)

// 帮助弹层 + Escape（开局无遮挡）
await page.locator('.help-btn').click()
await page.waitForTimeout(150)
check('help modal shown', await page.getByText('玩法').count() > 0)
await page.keyboard.press('Escape')
await page.waitForTimeout(150)
check('help closed by Escape', await page.getByText('玩法').count() === 0)

// L1: drag-fill 3 + hotspot ↑
for (let i = 0; i < 3; i++) await dragFirstToSlot(i)
check('L1 drag-fill: all placed', (await page.locator('.drag-piece').count()) === 0)
await page.getByRole('button', { name: '↑', exact: true }).click()
await page.waitForTimeout(250)
check('L1 page-complete modal', (await page.getByText('第 1 关完成').count()) > 0)
await page.getByRole('button', { name: '下一关' }).click()
await page.waitForTimeout(300)
check('L1 modal dismissed after next', (await page.getByText('第 1 关完成').count()) === 0)

// L2: flip-match 3 对 + quiz Jupiter
const cards = page.locator('.flip-card')
for (const [a, b] of [[0, 3], [1, 4], [2, 5]]) {
  await cards.nth(a).click(); await page.waitForTimeout(180)
  await cards.nth(b).click(); await page.waitForTimeout(460)
}
await page.getByRole('button', { name: 'Jupiter' }).click()
await page.waitForTimeout(250)
check('L2 page-complete modal', (await page.getByText('第 2 关完成').count()) > 0)
await page.getByRole('button', { name: '下一关' }).click()
await page.waitForTimeout(300)

// L3: drag-fill 5 + hotspot ← + quiz Cheetah
for (let i = 0; i < 5; i++) await dragFirstToSlot(i)
check('L3 drag-fill: all placed', (await page.locator('.drag-piece').count()) === 0)
await page.getByRole('button', { name: '←', exact: true }).click()
await page.waitForTimeout(150)
await page.getByRole('button', { name: 'Cheetah' }).click()
await page.waitForTimeout(250)
check('L3 final modal', (await page.getByText('全部完成').count()) > 0)

check('no console/page errors', errors.length === 0)
if (errors.length) console.log('ERRORS:\n' + errors.join('\n'))

await browser.close()
console.log(`\nRESULT: ${ok.length} passed, ${fail.length} failed`)
process.exit(fail.length ? 1 : 0)

const fs = require("fs")
const { Builder, By, Key, until } = require('selenium-webdriver')

const search_terms = ["window tinting in the usa"]

const website_selector = ".etWJQ.jym1ob.kdfrQc.bWQG4d:not(.etWJQ.jym1ob.kdfrQc.bWQG4d ~ .etWJQ.jym1ob.kdfrQc.bWQG4d) .lcr4fd.S9kvJb"

const main = async () => {
    let driver = await new Builder().forBrowser("chrome").build()

    await driver.get('https://maps.google.com')

    search_terms.map(async search_term => {
        await driver.wait(until.elementLocated(By.name('q'))).sendKeys(search_term, Key.RETURN)

        const results = await driver.wait(until.elementsLocated(By.css(website_selector)))

        if (results.length > 50) results.length = 50

        results.forEach(async result => {
            await result.click()

            const tabs = await driver.getAllWindowHandles()
            await driver.switchTo().window(tabs[1])

            const getEmail = async () => {
                try {
                    const link = await Promise.race([
                        driver.wait(until.elementLocated(By.css("a[href*='mailto']"))),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                    ])

                    const addr = await link.getAttribute("href")

                    return addr
                } catch (error) {
                    console.error(error)
                    return null
                }
            }

            let email = await getEmail()

            if (!email) {
                try {
                    await driver.get(`${await driver.getCurrentUrl()}/contact`)
                } catch (error) {
                    console.error(error)
                }

                email = await getEmail()
            }

            await driver.close()
            await driver.switchTo().window(tabs[0])

            if (email && !fs.readFileSync("emails.txt").includes(email)) {
                if (fs.existsSync("emails.txt")) fs.appendFileSync("emails.txt", email + "\n")
                else fs.writeFileSync("emails.txt", email + "\n")
            }
        })

        await driver.findElement(By.name('q')).sendKeys(Key.CONTROL, "a", Key.DELETE, Key.NULL)
    })
}

export default main

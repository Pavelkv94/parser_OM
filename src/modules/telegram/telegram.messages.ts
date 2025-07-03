import { Car, Filter } from "@/prisma/generated";
import { CarData } from "../scrapper/scrapper.service";

export const TEMP_TEXT = 'tempText';
export const TELEGRAM_MESSAGES = {
    start: 'Welcome to the Otomoto assistant!',
    welcomeWithoutToken: 'Welcome to the Otomoto assistant! Please get your token to connect your account.',
    haventRights: 'You haven\'t rights to use this command!',
    invalidToken: 'Invalid token!',
    yourToken: (token: string) => `New invite link is:\n https://t.me/otoseeker_bot?start=${token}`,
    telegramConnected: 'Telegram connected successfully!',
    filtersSet: 'Filters set successfully!',
    filtersAlreadySet: 'Filters already set!',
    noCars: 'No cars found for your filters.',
    car: (car: CarData) => `
      ${car.title ? `${car.title} (${car.year})` : TEMP_TEXT}
${car.description ? `${car.description}` : TEMP_TEXT}
    ${car.milleage ? `🛣️ ${car.milleage}` : TEMP_TEXT}
    ${car.fuel ? `⛽ ${car.fuel}` : TEMP_TEXT}
    ${car.transmission ? `⚙️ ${car.transmission}` : TEMP_TEXT}

    ${car.privateType ? `🔒 ${car.privateType}` : TEMP_TEXT}
    ${car.publicAt ? `🕒 ${car.publicAt}` : TEMP_TEXT}

    ${car.location ? `📍 ${car.location}` : TEMP_TEXT}

    ${car.price ? `💰 ${car.price}` : TEMP_TEXT}

    ${car.link ? `🔗 ${car.link}` : TEMP_TEXT}`.replace(TEMP_TEXT, ''),

    filter: (filter: Filter) => `
🏎 <b>${filter.enabled ? '🟢' : '🔴'} ${filter.brand.toUpperCase()} ${filter.model.toUpperCase()}</b>
🏠 <b>City:</b> ${filter.city.toUpperCase()}

📅 <b>From Year:</b> ${filter.fromYear}    
⛽ <b>Fuel Type:</b> ${filter.fuelType}
⚙️ <b>Gearbox:</b> ${filter.gearbox}
💨 <b>Engine Capacity:</b> ${filter.engine_capacity_from} - ${filter.engine_capacity_to}
💰 <b>Price:</b> ${filter.price_from} - ${filter.price_to}
`,

    newCar: (car: Car) => `
🔥New car found🔥

${car.title ? `${car.title} (${car.year})` : TEMP_TEXT}
${car.description ? `${car.description}` : TEMP_TEXT}

    ${car.milleage ? `🛣️ ${car.milleage}` : TEMP_TEXT}
    ${car.fuel ? `⛽ ${car.fuel}` : TEMP_TEXT}
    ${car.transmission ? `⚙️ ${car.transmission}` : TEMP_TEXT}

    ${car.privateType ? `🔒 ${car.privateType}` : TEMP_TEXT}
    ${car.publicAt ? `🕒 ${car.publicAt}` : TEMP_TEXT}

    ${car.location ? `📍 ${car.location}` : TEMP_TEXT}

    ${car.price ? `💰 ${car.price}` : TEMP_TEXT}

    🔗 ${car.link}`.replace(TEMP_TEXT, ''),
    foundedCars: (count: string) => `
🔍 Found ${count} cars
`
}
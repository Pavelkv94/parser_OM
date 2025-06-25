import { Markup } from 'telegraf';

export enum TelegramButtons {
    ShowLastCars = 'Show Last Cars',
    SetFilters = 'Set filters',
    GenerateNewToken = 'Generate New Token',
    GetCarsByFilter = 'Get Cars By Filter',
    GetFilters = 'Get Filters',
    ShowFilterResults = 'Show Filter Results',
}

export const TELEGRAM_BUTTONS = {
    userButtons: () =>
        Markup.keyboard([
            Markup.button.text(TelegramButtons.GetFilters)
        ]).resize(),

    adminButtons: () =>
        Markup.keyboard([
            [
            //Markup.button.text(TelegramButtons.ShowLastCars),
            Markup.button.text(TelegramButtons.SetFilters),
            Markup.button.text(TelegramButtons.GenerateNewToken)
            ],
            [
                Markup.button.text(TelegramButtons.GetFilters)
            ],
        ]).resize(),

    showFilterResults: (filterId: string) =>
        Markup.inlineKeyboard([
            Markup.button.callback(
                TelegramButtons.ShowFilterResults,
                `${TelegramButtons.ShowFilterResults}:${filterId}`
            )
        ])
    ,
};

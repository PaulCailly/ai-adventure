export function generateImagePrompt({
  race,
  heroClass,
  weapon,
  companion,
  symbol,
}: {
  race: string;
  heroClass: string;
  weapon: string;
  companion: string;
  symbol: string;
}) {
  return `Create a captivating fantasy portrait of a ${race} ${heroClass} equipped with a ${weapon}.
    The character is accompanied by a loyal ${companion}.
    The character is wearing a discreet necklace or a ring with a symbol of ${symbol}.
    The scene features an environment characteristic of the ${race} race.
    The art style should be highly detailed with rich textures, vibrant colors, and professional video game quality rendering using Unreal Engine 5.
    Focus on specific, visually representable elements.
    Avoid ambiguous language that could be interpreted as including text.
    Do not use any character on image.
    Do not use any User Interface elements on image.`;
}

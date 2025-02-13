export const translateText = async (text, source, target) => {
  try {
    const response = await fetch(
      `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
};

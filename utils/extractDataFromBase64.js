async function extractDataFromBase64(base64encode) {
  try {
    // Remove the base64 prefix if it exists (e.g., "data:image/svg+xml;base64,")
    const base64Data = base64encode.replace(/^(data:[\w\/]+;base64,)/, "");
    // Decode the base64 data and parse it as JSON
    const jsonData = Buffer.from(base64Data, "base64").toString("utf-8");

    const extractedData = JSON.parse(jsonData);

    return extractedData;
  } catch (error) {
    console.error("Error extracting data from Base64:", error);
    return null;
  }
}

module.exports = extractDataFromBase64;

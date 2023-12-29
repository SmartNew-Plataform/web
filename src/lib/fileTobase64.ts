export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function () {
      // O resultado é a representação Base64 do arquivo
      const base64String = (reader.result as string).split(',')[1]
      resolve(base64String)
    }

    reader.onerror = function (error) {
      reject(error)
    }

    // Lê o arquivo como uma URL de dados
    reader.readAsDataURL(file)
  })
}

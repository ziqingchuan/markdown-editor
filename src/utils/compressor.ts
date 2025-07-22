import Compressor from 'compressorjs'

const compressImage = (
    file: File,
    quality: number = 0.7,
    maxWidth: number = 1920,
    minSizeToCompress: number = 200,
    targetSizeKB: number = 100,
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const fileSizeKB = file.size / 1024

        // 如果文件大小小于指定值，则不压缩，返回源文件
        if (fileSizeKB < minSizeToCompress) {
            console.log(`文件大小 ${fileSizeKB.toFixed(2)}KB 小于 ${minSizeToCompress}KB, 不进行压缩.`)
            resolve(file)
            return
        }

        // 将 PNG 转换为 JPG
        const convertToJpg = (file: File): Promise<File> => {
            return new Promise((resolveConvert, rejectConvert) => {
                const reader = new FileReader()

                reader.onload = (event) => {
                    const img = new Image()
                    img.src = event.target?.result as string

                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        if (!ctx) {
                            rejectConvert(new Error('无法获取 Canvas 上下文'))
                            return
                        }

                        // 设置 canvas 尺寸
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx.drawImage(img, 0, 0)

                        // 转换为 Blob
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    resolveConvert(
                                        new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                            type: 'image/jpeg',
                                        }),
                                    )
                                } else {
                                    rejectConvert(new Error('转换为 JPEG 时出现问题'))
                                }
                            },
                            'image/jpeg',
                            quality,
                        )
                    }

                    img.onerror = (err) => rejectConvert(err)
                }

                reader.onerror = (err) => rejectConvert(err)
                reader.readAsDataURL(file)
            })
        }

        // 进行转换并压缩
        convertToJpg(file)
            .then((jpgFile) => {
                // 使用 Compressor.js 进行压缩
                const checkCompressionQuality = (qualityValue: number): Promise<File> => {
                    return new Promise((resolveCompress, rejectCompress) => {
                        new Compressor(jpgFile, {
                            quality: qualityValue,
                            maxWidth: maxWidth,
                            success(result: any) {
                                console.log(`压缩成功, 压缩后大小 ${result.size / 1024}KB, 压缩后的文件类型: ${result.type}.`)
                                resolveCompress(result as File)
                            },
                            error(err: any) {
                                console.error(err)
                                rejectCompress(new Error('压缩失败'))
                            },
                        })
                    })
                }

                const binarySearchForCompression = async (low: number, high: number, attempt: number = 0): Promise<File> => {
                    if (attempt > 10) {
                        console.warn('二分法尝试次数过多，停止尝试.')
                        throw new Error('无法压缩到指定大小')
                    }

                    const mid = (low + high) / 2
                    const compressedFile = await checkCompressionQuality(mid)

                    if (compressedFile) {
                        const compressedSizeKB = compressedFile.size / 1024
                        console.log(`尝试压缩质量 ${mid}, 结果文件大小: ${compressedSizeKB.toFixed(2)}KB`)

                        if (compressedSizeKB <= targetSizeKB) {
                            // 压缩成功且小于目标大小，尝试更高质量
                            return compressedFile
                        } else {
                            // 压缩后仍然大于目标大小，降低质量
                            return binarySearchForCompression(low, mid, attempt + 1)
                        }
                    } else {
                        // 压缩失败，抛出异常
                        throw new Error('压缩失败')
                    }
                }

                binarySearchForCompression(0, 1)
                    .then((compressedFile) => {
                        console.log(`压缩成功, 压缩后大小 ${compressedFile.size / 1024}KB.`)
                        resolve(compressedFile)
                    })
                    .catch((error) => {
                        console.error('压缩过程中发生错误:', error)
                        reject(error)
                    })
            })
            .catch((error) => {
                console.error('转换过程中发生错误:', error)
                reject(error)
            })
    })
}

export default compressImage
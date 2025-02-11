/**
 * ฟังก์ชันสำหรับจัดการการตอบกลับของ API
 * @param res - Response object
 * @param data - ข้อมูลที่ต้องการส่งกลับ
 * @param message - ข้อความที่ต้องการส่งกลับ
 * @param statusCode - รหัสสถานะ HTTP
 */
export function sendResponse(res: any, data: any, message: string = 'Success', statusCode: number = 200) {
    res.status(statusCode).json({
      message,
      data,
    });
  }
  
  /**
   * ฟังก์ชันสำหรับจัดการข้อผิดพลาดของ API
   * @param res - Response object
   * @param error - ข้อผิดพลาดที่ต้องการส่งกลับ
   * @param statusCode - รหัสสถานะ HTTP
   */
  export function sendError(res: any, error: any, statusCode: number = 500) {
    res.status(statusCode).json({
      message: 'Error',
      error,
    });
  }
  
  /**
   * ฟังก์ชันสำหรับตรวจสอบว่าเป็นอีเมลที่ถูกต้องหรือไม่
   * @param email - อีเมลที่ต้องการตรวจสอบ
   * @returns true ถ้าเป็นอีเมลที่ถูกต้อง, false ถ้าไม่ถูกต้อง
   */
  export function isValidEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
  
  /**
   * ฟังก์ชันสำหรับสร้าง UUID
   * @returns UUID string
   */
  export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
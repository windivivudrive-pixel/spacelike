export const translations = {
    VI: {
        'dashboard.language.vi': 'Việt Nam',
        'dashboard.language.en': 'English',

        // Sidebar
        'sidebar.overview': 'Tổng Quan',
        'sidebar.servicePricing': 'Bảng Giá Dịch Vụ',
        'sidebar.profile': 'Hồ Sơ',
        'sidebar.addFunds': 'Nạp Tiền',
        'sidebar.transactions': 'Lịch Sử Giao Dịch',
        'sidebar.productsServices': 'SẢN PHẨM & DỊCH VỤ',

        // Dashboard Overview
        'dashboard.welcomeBack': 'Chào mừng trở lại',
        'dashboard.currentBalance': 'Số Dư Hiện Tại',
        'dashboard.totalDeposited': 'Tổng Đã Nạp',
        'dashboard.notifications': 'Thông Báo',
        'dashboard.viewAll': 'Xem Tất Cả',
        'dashboard.orders': 'Đơn Hàng',
        'dashboard.noOrdersYet': 'Chưa có đơn hàng nào',

        // Order Form
        'order.newOrder': 'Tạo Đơn Mới',
        'order.fillDetails': 'Điền thông tin và số lượng để tự động tính phí.',
        'order.serviceCategory': 'Danh Mục Dịch Vụ',
        'order.servicePackage': 'Gói Dịch Vụ',
        'order.targetLink': 'Đường Dẫn (Link)',
        'order.quantity': 'Số Lượng',
        'order.totalCharge': 'Thành Tiền',
        'order.submit': 'Thanh Toán & Xác Nhận Đơn',
        'order.specs': 'Thông số',
        'order.followers': 'Followers [Bảo Hành 30 Ngày]',
        'order.likes': 'Likes [Siêu Tốc]',
        'order.views': 'Views [Đề Xuất]',
        'order.loadingServices': 'Đang tải dịch vụ...',
        'order.noServices': 'Không có dịch vụ nào.',
        'order.loginRequired': 'Vui lòng đăng nhập để đặt đơn.',
        'order.insufficientBalance': 'Số dư không đủ. Vui lòng nạp thêm tiền.',
        'order.orderSuccess': 'Đặt đơn thành công!',
        'order.orderError': 'Đã xảy ra lỗi khi đặt đơn.',
        'order.processing': 'Đang xử lý...',

        // Add Funds
        'addFunds.title': 'Nạp Tiền Nhanh Chóng',
        'addFunds.description': 'Quét mã QR bằng ứng dụng ngân hàng của bạn. Số dư sẽ được cộng tự động trong 5-10 giây.',
        'addFunds.amountPlaceholder': 'Nhập số tiền cần nạp...',
        'addFunds.quickSelect': 'Gợi ý nạp',
        'addFunds.generateQR': 'Tạo Mã QR',
        'addFunds.qrInstruction': 'Quét mã QR dưới đây',
        'addFunds.qrContent': 'Nội dung chuyển khoản (Bắt buộc)',
        'addFunds.qrCopy': 'Sao chép nội dung',
        'addFunds.qrWarning': 'Vui lòng điền ĐÚNG BẤT CHẤP nội dung chuyển khoản để hệ thống tự động cộng tiền.',
        'addFunds.success': 'Nạp tiền thành công! Đã cộng vào số dư của bạn.',
    },
    EN: {
        'dashboard.language.vi': 'Vietnam',
        'dashboard.language.en': 'English',

        // Sidebar
        'sidebar.overview': 'Overview',
        'sidebar.servicePricing': 'Service Pricing',
        'sidebar.profile': 'Profile',
        'sidebar.addFunds': 'Add Funds',
        'sidebar.transactions': 'Transaction History',
        'sidebar.productsServices': 'PRODUCTS & SERVICES',

        // Dashboard Overview
        'dashboard.welcomeBack': 'Welcome back',
        'dashboard.currentBalance': 'Current Balance',
        'dashboard.totalDeposited': 'Total Deposited',
        'dashboard.notifications': 'Notifications',
        'dashboard.viewAll': 'View All',
        'dashboard.orders': 'Orders',
        'dashboard.noOrdersYet': 'No orders yet',

        // Order Form
        'order.newOrder': 'New Order',
        'order.fillDetails': 'Fill in details and quantity to calculate automatically.',
        'order.serviceCategory': 'Service Category',
        'order.servicePackage': 'Service Package',
        'order.targetLink': 'Target Link',
        'order.quantity': 'Quantity',
        'order.totalCharge': 'Total Charge',
        'order.submit': 'Pay & Confirm Order',
        'order.specs': 'Specs',
        'order.followers': 'Followers [30 Days Refill]',
        'order.likes': 'Likes [Ultra Fast]',
        'order.views': 'Views [Recommended]',
        'order.loadingServices': 'Loading services...',
        'order.noServices': 'No services available.',
        'order.loginRequired': 'Please login to place an order.',
        'order.insufficientBalance': 'Insufficient balance. Please add funds.',
        'order.orderSuccess': 'Order placed successfully!',
        'order.orderError': 'Error placing order.',
        'order.processing': 'Processing...',

        // Add Funds
        'addFunds.title': 'Fast Deposit',
        'addFunds.description': 'Scan the QR code with your banking app. Balance updates automatically in 5-10 seconds.',
        'addFunds.amountPlaceholder': 'Input amount to deposit...',
        'addFunds.quickSelect': 'Quick Select',
        'addFunds.generateQR': 'Generate QR Code',
        'addFunds.qrInstruction': 'Scan the QR code below',
        'addFunds.qrContent': 'Transfer Content (Required)',
        'addFunds.qrCopy': 'Copy Content',
        'addFunds.qrWarning': 'Please write EXACTLY the transfer content above so the system accurately credits your account.',
        'addFunds.success': 'Deposit successful! Funds added to your balance.',
    }
};

export type TranslationKey = keyof typeof translations.EN;

import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get("token")?.value; // Lấy JWT token từ cookie
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/register"].includes(url.pathname);

  if (!token) {
    // Nếu không có token mà đang ở trang đăng nhập, tiếp tục cho truy cập
    // Điều hướng đến trang đăng nhập nếu đang ở trang yêu cầu đăng nhập
    return isAuthPage ? NextResponse.next() : redirectToLogin(url);
  }

  // Kiểm tra token hợp lệ
  try {
    const user = await verifyToken(token);

    // Token không hợp lệ hoặc hết hạn, chuyển hướng đến trang đăng nhập
    if (!user) {
      return redirectToLogin(url);
    }

    if (isAdminRoute && !isAdmin(user)) {
      return redirectToHome(url);
    }

    if (isAuthPage) {
      return redirectToHome(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    redirectToLogin(url);
  }
}

// Hàm gọi API xác thực token và lấy thông tin người dùng
async function verifyToken(token) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
      {
        method: "GET",
        headers: { Cookie: `token=${token}` },
      }
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}

// Kiểm tra quyền admin
function isAdmin(user) {
  return user.role === 0; // role 0 là admin
}

// Chuyển hướng đến trang login
function redirectToLogin(url) {
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

// Chuyển hướng đến trang chủ nếu không có quyền admin
function redirectToHome(url) {
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/profile", "/tickets"],
};

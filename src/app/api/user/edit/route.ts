import { ExtendedUserDataSchema } from "~/schemas";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { upsertUser } from "~/server/queries";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper function to create standardized success response
function createSuccessResponse<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

// Helper function to create standardized error response
function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, string>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
    },
    { status: getHttpStatusFromCode(code) }
  );
}

// Map error codes to HTTP status codes
function getHttpStatusFromCode(code: string): number {
  const statusMap: Record<string, number> = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  };
  return statusMap[code] ?? 500;
}

// Main API handler
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<typeof ExtendedUserDataSchema._type>>> {
  try {
    // Parse request body
    const result = ExtendedUserDataSchema.parse(await request.json().catch(() => {
      throw new Error("Invalid JSON");
    }));
    const resultQuery = await upsertUser(result)
    // Return success response
    return createSuccessResponse(result);
    
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const details = Object.fromEntries(
        error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ])
      );
      
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid request data",
        details
      );
    }

    // Handle JSON parsing errors
    if (error instanceof Error && error.message === "Invalid JSON") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid JSON in request body"
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return createErrorResponse(
      "INTERNAL_ERROR",
      "An unexpected error occurred"
    );
  }
}
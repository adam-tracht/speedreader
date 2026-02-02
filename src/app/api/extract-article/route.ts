import { extract } from '@extractus/article-extractor';
import { NextRequest, NextResponse } from 'next/server';

interface Article {
  title?: string | null;
  content?: string | null;
}

interface SuccessResponse {
  success: true;
  title: string;
  content: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ExtractArticleResponse = SuccessResponse | ErrorResponse;

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ExtractArticleResponse>> {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL is present
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Extract article
    const article: Article | null = await extract(url);

    // Check if extraction was successful
    if (!article || !article.title || !article.content) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract article from the provided URL' },
        { status: 422 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        title: article.title,
        content: article.content,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle extraction errors
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

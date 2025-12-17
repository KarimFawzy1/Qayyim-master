export interface TeacherExam {
  id: string;
  title: string;
  description: string | null;
  type: string;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  courseCode: string | null;
  courseName: string | null;
  totalSubmissions: number;
  gradedSubmissions: number;
}

export interface AvailableCourse {
  courseCode: string;
  courseName: string;
}

export interface TeacherExamsResponse {
  exams: TeacherExam[];
  availableCourses: AvailableCourse[];
}

/**
 * Fetches all exams for the current teacher/instructor
 * @param courseCode Optional course code to filter exams
 * @returns Promise with exams and available courses data
 * @throws Error if the request fails
 */
export async function getTeacherExams(courseCode?: string): Promise<TeacherExamsResponse> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (courseCode) {
      queryParams.append('courseCode', courseCode);
    }
    const queryString = queryParams.toString();
    const url = `/api/v1/teacher/exams${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch exams: ${response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching teacher exams:', error);
    throw error;
  }
}


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

import { StudentDashboard } from '../pages/dashboard/StudentDashboard';
import { CourseCatalog } from '../pages/course-catalog/CourseCatalog';
import { CourseDetailsPage } from '../pages/course-catalog/CourseDetailsPage';
import { CoursePlayer } from '../pages/course-player/CoursePlayer';
import { QuizzesPage } from '../pages/quizzes/QuizzesPage';
import { AssignmentsPage } from '../pages/quizzes/AssignmentsPage';
import { CertificatesPage } from '../pages/quizzes/CertificatesPage';
import { AchievementsPage } from '../pages/quizzes/AchievementsPage';
import { DiscussionsPage } from '../pages/quizzes/DiscussionsPage';
import { NotificationsPage } from '../pages/quizzes/NotificationsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SettingsPage } from '../pages/profile/SettingsPage';

import { InstructorDashboard } from '../pages/instructor/InstructorDashboard';
import { CourseAuthoringWizard } from '../pages/instructor/CourseAuthoringWizard';

import { AdminDashboard } from '../pages/admin-panel/AdminDashboard';
import { UserManagement } from '../pages/admin-panel/UserManagement';
import { CourseApprovalQueue } from '../pages/admin-panel/CourseApprovalQueue';
import { ContentModeration } from '../pages/admin-panel/ContentModeration';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Student & Shared Routes */}
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route path="catalog" element={<CourseCatalog />} />
          <Route path="course-player" element={<CoursePlayer />} />
          <Route path="learn/:id" element={<CoursePlayer />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="discussions" element={<DiscussionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Instructor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
            <Route path="instructor" element={<InstructorDashboard />} />
            <Route path="instructor-dashboard" element={<InstructorDashboard />} />
            <Route path="create-course" element={<CourseAuthoringWizard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin-panel" element={<AdminDashboard />} />
            <Route path="admin-users" element={<UserManagement />} />
            <Route path="admin-approvals" element={<CourseApprovalQueue />} />
            <Route path="admin-moderation" element={<ContentModeration />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

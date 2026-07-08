import 'package:go_router/go_router.dart';
import '../../features/companies/presentation/companies_page.dart';
import '../../features/customers/presentation/customers_page.dart';
import '../../features/dashboard/presentation/dashboard_page.dart';
import '../../features/mileage/presentation/mileage_page.dart';
import '../../features/projects/presentation/projects_page.dart';
import '../../features/settings/presentation/settings_page.dart';
import '../../features/time_report/presentation/time_report_page.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const DashboardPage()),
    GoRoute(path: '/time-report', builder: (_, __) => const TimeReportPage()),
    GoRoute(path: '/mileage', builder: (_, __) => const MileagePage()),
    GoRoute(path: '/companies', builder: (_, __) => const CompaniesPage()),
    GoRoute(path: '/projects', builder: (_, __) => const ProjectsPage()),
    GoRoute(path: '/customers', builder: (_, __) => const CustomersPage()),
    GoRoute(path: '/settings', builder: (_, __) => const SettingsPage()),
  ],
);

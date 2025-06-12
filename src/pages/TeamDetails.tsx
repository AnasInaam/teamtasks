// TODO: This TeamDetails page currently lacks real data integration.
// - Replace all mockTeam and related mock data with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for editing team, adding/removing members, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ChevronLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  MessageSquare,
  FileText,
} from 'lucide-react';

// TODO: Connect to backend for team, members, projects, and activity data
// const mockTeam = {...};

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'files'>('overview');

  // TODO: Fetch team, members, projects, and activity data from backend using id
  // const team = ...

  return (
    <div>
      {/* TODO: Render real team details, members, projects, files, and activity from backend */}
    </div>
  );
};

export default TeamDetails;
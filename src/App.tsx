import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TourModal } from './components/TourModal';

// Views
import { DashboardView } from './views/DashboardView';
import { InboxView } from './views/InboxView';
import { SuppliersView } from './views/SuppliersView';
import { GroupingView } from './views/GroupingView';
import { ReviewView } from './views/ReviewView';
import { FabricWallView } from './views/FabricWallView';
import { MatchingView } from './views/MatchingView';
import { MissingCenterView } from './views/MissingCenterView';
import { SupplierSubmissionView } from './views/SupplierSubmissionView';

// Initial Mock Data
import { INITIAL_FABRICS, INITIAL_IMPORT_JOBS, INITIAL_SUPPLIERS, SupplierProfile } from './mockData';
import { FabricMaster } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [fabrics, setFabrics] = useState<FabricMaster[]>(INITIAL_FABRICS);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(INITIAL_SUPPLIERS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDesensitizedMode, setIsDesensitizedMode] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [matchedFabricId, setMatchedFabricId] = useState<string | undefined>();
  const [selectedReviewFabricId, setSelectedReviewFabricId] = useState<string | undefined>();

  // Statistics calculation for badges & header counters
  const reviewPendingCount = useMemo(() => {
    return fabrics.filter((f) => f.reviewStatus === 'pending_review').length;
  }, [fabrics]);

  const missingCount = useMemo(() => {
    return fabrics.filter((f) => (f.missingFields?.length || 0) > 0 || f.reviewStatus === 'missing_info')
      .length;
  }, [fabrics]);

  const conflictCount = useMemo(() => {
    return fabrics.filter((f) => (f.conflictFields?.length || 0) > 0).length;
  }, [fabrics]);

  // Updating fabric in state
  const handleUpdateFabric = (updatedFabric: FabricMaster) => {
    setFabrics((prev) =>
      prev.map((f) => (f.id === updatedFabric.id ? updatedFabric : f))
    );
  };

  // Adding newly submitted fabric from supplier
  const handleAddNewFabric = (newFabric: FabricMaster) => {
    setFabrics((prev) => [newFabric, ...prev]);

    // Check if supplier exists, otherwise add new supplier profile
    setSuppliers((prev) => {
      const exists = prev.find(
        (s) =>
          s.name.trim().toLowerCase() === newFabric.supplierName.trim().toLowerCase() ||
          (newFabric.supplierShortName && s.shortName.trim().toLowerCase() === newFabric.supplierShortName.trim().toLowerCase())
      );

      if (exists) {
        return prev.map((s) =>
          s.id === exists.id
            ? { ...s, totalFabricsCount: s.totalFabricsCount + 1, confirmedFabricsCount: s.confirmedFabricsCount + 1 }
            : s
        );
      } else {
        const newSupplier: SupplierProfile = {
          id: `SUP-${String(prev.length + 1).padStart(3, '0')}`,
          name: newFabric.supplierName,
          shortName: newFabric.supplierShortName || newFabric.supplierName.slice(0, 2),
          codePrefix: (newFabric.supplierShortName || newFabric.supplierName.slice(0, 2)).toUpperCase(),
          contactPerson: newFabric.supplierContact || '业务负责人',
          phone: newFabric.supplierPhone || '待补充',
          city: '国内产业带',
          categorySpecialty: [newFabric.marketFabricType?.value || '针织/梭织面料'],
          cooperationTier: '储备开发',
          totalFabricsCount: 1,
          missingFieldsCount: 0,
          confirmedFabricsCount: 1,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        return [newSupplier, ...prev];
      }
    });
  };

  // Navigate to matching with a specific fabric
  const handleNavigateToMatch = (fabricId: string) => {
    setMatchedFabricId(fabricId);
    setActiveTab('matching');
  };

  // Navigate to review with a specific fabric
  const handleNavigateToReview = (fabricId: string) => {
    setSelectedReviewFabricId(fabricId);
    setActiveTab('review');
  };

  return (
    <div className="h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col antialiased selection:bg-zinc-900 selection:text-white overflow-hidden">
      {/* Top Global Navigation Bar */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isDesensitizedMode={isDesensitizedMode}
        onToggleDesensitizedMode={() => setIsDesensitizedMode(!isDesensitizedMode)}
        onOpenTour={() => setIsTourOpen(true)}
        onNavigate={setActiveTab}
        totalFabricsCount={fabrics.length}
        missingCount={missingCount}
        conflictCount={conflictCount}
      />

      <div className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-900">
        V1视觉参考 · 非上线系统 · 企业、联系人、电话与价格均为虚构样例 · 禁止录入真实资料
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'fabric_wall' && searchTerm) {
              // keep search term
            }
          }}
          reviewPendingCount={reviewPendingCount}
          groupingPendingCount={2}
          missingCount={missingCount}
          conflictCount={conflictCount}
        />

        {/* Center Main Scrollable View */}
        <main className="flex-1 overflow-y-auto bg-zinc-100/60 pb-16 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              importJobs={INITIAL_IMPORT_JOBS}
              fabrics={fabrics}
              onOpenTour={() => setIsTourOpen(true)}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxView
              onNavigate={setActiveTab}
              onAddNewFabric={handleAddNewFabric}
              importJobs={INITIAL_IMPORT_JOBS}
              suppliers={suppliers}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              fabrics={fabrics}
              onNavigate={setActiveTab}
              onUpdateFabric={handleUpdateFabric}
              suppliersList={suppliers}
            />
          )}

          {activeTab === 'grouping' && (
            <GroupingView onNavigate={setActiveTab} />
          )}

          {activeTab === 'review' && (
            <ReviewView
              fabrics={fabrics}
              initialFabricId={selectedReviewFabricId}
              onUpdateFabric={handleUpdateFabric}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'fabric_wall' && (
            <FabricWallView
              fabrics={fabrics}
              searchTerm={searchTerm}
              isDesensitizedMode={isDesensitizedMode}
              onToggleDesensitizedMode={() => setIsDesensitizedMode(!isDesensitizedMode)}
              onNavigateToMatch={handleNavigateToMatch}
              onUpdateFabric={handleUpdateFabric}
              onEditFabric={(f) => {
                handleNavigateToReview(f.id);
              }}
            />
          )}

          {activeTab === 'matching' && (
            <MatchingView
              fabrics={fabrics}
              initialFabricId={matchedFabricId}
              onNavigateToDetail={(f) => {
                setActiveTab('fabric_wall');
              }}
            />
          )}

          {activeTab === 'missing_center' && (
            <MissingCenterView
              fabrics={fabrics}
              onUpdateFabric={handleUpdateFabric}
              onNavigateToReview={handleNavigateToReview}
            />
          )}

          {activeTab === 'supplier_submit' && (
            <SupplierSubmissionView
              onAddNewFabric={handleAddNewFabric}
              onNavigateToInbox={() => setActiveTab('inbox')}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Guided Tour Modal */}
      <TourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}

import React, { ReactNode, useEffect, useState } from 'react';
import { TourProvider as ReactTourProvider, useTour } from '@reactour/tour';
import { useRouter } from 'next/router';

const steps = [
  {
    selector: '.main-content',
    content: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', fontWeight: '600' }}>
          Welcome to Skooltym!
        </h3>
        <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6' }}>
          Let's get you started with a quick tour of the system. First, you'll need to change your password for security.
        </p>
      </div>
    ),
    position: 'center' as const,
  },
  {
    selector: '[data-tour="change-password"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Change Your Password
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          For security reasons, please change your default password. Click here to access the password change form.
        </p>
      </div>
    ),
    position: 'right' as const,
    actionAfter: () => {
      // Add temporary highlighting to sidebar item
      const element = document.querySelector('[data-tour="change-password"]') as HTMLElement;
      if (element) {
        element.style.cssText += `
          animation: pulse 2s infinite !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.5) !important;
          border-radius: 8px !important;
          background-color: rgba(37, 99, 235, 0.1) !important;
        `;
      }
    },
  },
  {
    selector: '[data-tour="password-form"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Password Change Form
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Enter your current password and choose a new secure password. Make sure to remember it!
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="settings"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          School Settings
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Now let's configure your school settings. This includes basic information about your institution.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="settings-form"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Configure Settings
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Fill in your school details like name, address, and other important information.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="streams"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Add Streams
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Streams help organize your academic programs. Let's add your first stream (e.g., Science, Arts, Commerce).
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="add-stream"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Create New Stream
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Click the "Add Stream" button to create your school's academic streams.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '[data-tour="classes"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Add Classes
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Classes are specific grade levels within streams. Let's create classes and link them to streams.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="add-class"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Create New Class
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Click to add a new class and associate it with the appropriate stream.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '[data-tour="students"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Add Students
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Time to add your first student! Students are the heart of your school management system.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="add-student"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Register New Student
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Click here to register your first student with all necessary details.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '[data-tour="staff"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Add Staff Members
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Let's add staff members who will help manage your school operations.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="add-staff"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Register New Staff
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Add teachers, administrators, and other staff members to your system.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '[data-tour="guardians"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Add Guardians
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Finally, let's add guardians who are responsible for the students.
        </p>
      </div>
    ),
    position: 'right' as const,
  },
  {
    selector: '[data-tour="add-guardian"]',
    content: (
      <div style={{ padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Register New Guardian
        </h4>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Add parents or guardians and link them to their children in the system.
        </p>
      </div>
    ),
    position: 'left' as const,
  },
  {
    selector: '[data-tour="sidebar"]',
    content: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', fontWeight: '600' }}>
          Explore Other Modules
        </h3>
        <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6' }}>
          Great! You've completed the essential setup. Feel free to explore other modules like Payments, Clocking, and Reports.
        </p>
      </div>
    ),
    position: 'center' as const,
  },
  {
    selector: 'body',
    content: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', fontWeight: '600' }}>
          Tour Complete!
        </h3>
        <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6' }}>
          Congratulations! You've successfully completed the setup tour. Your school management system is ready to use.
        </p>
      </div>
    ),
    position: 'center' as const,
  },
];

interface TourControllerProps {
  children: ReactNode;
}

const TourController: React.FC<TourControllerProps> = ({ children }) => {
  const { setIsOpen, setCurrentStep } = useTour();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Inject CSS for enhanced sidebar highlighting
  useEffect(() => {
    const styleId = 'tour-sidebar-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes sidebarPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        
        .sidebar-tour-highlight {
          animation: sidebarPulse 2s infinite !important;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(37, 99, 235, 0.05)) !important;
          border-left: 4px solid #2563eb !important;
          border-radius: 0 8px 8px 0 !important;
          position: relative !important;
        }
        
        .sidebar-tour-highlight::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -6px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #2563eb;
        }
        
        .sidebar-tour-highlight .side-menu__label {
          font-weight: 600 !important;
          color: #2563eb !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    // Check user role and tour completion status
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('skooltym_user');
      const tourCompleted = localStorage.getItem('skooltym_tour_completed');

      if (userString) {
        try {
          const user = JSON.parse(userString);
          setUserRole(user.role);

          // Only show tour for admin users who haven't completed it
          if (user.role === 'Admin' && tourCompleted !== 'true' && router.pathname === '/dashboard') {
            setTimeout(() => {
              setIsOpen(true);
            }, 1000);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [router.pathname, setIsOpen]);

  const handleTourClose = () => {
    // Mark tour as completed
    if (typeof window !== 'undefined') {
      localStorage.setItem('skooltym_tour_completed', 'true');
    }
    setIsOpen(false);
  };

  const handleStepChange = (step: number) => {
    // Navigate to appropriate route based on step
    const stepRoutes = [
      '/dashboard',                    // Welcome
      '/dashboard/ChangePassword',     // Change password nav
      '/dashboard/ChangePassword',     // Password form
      '/dashboard/Settings',           // Settings nav
      '/dashboard/Settings',           // Settings form
      '/dashboard/Streams',            // Streams nav
      '/dashboard/Streams',            // Add stream button
      '/dashboard/Classes',            // Classes nav
      '/dashboard/Classes',            // Add class button
      '/dashboard/Students',           // Students nav
      '/dashboard/Students',           // Add student button
      '/dashboard/Staff',              // Staff nav
      '/dashboard/Staff',              // Add staff button
      '/dashboard/Guardians',          // Guardians nav
      '/dashboard/Guardians',          // Add guardian button
      '/dashboard',                    // Explore modules
      '/dashboard',                    // Complete
    ];

    const targetRoute = stepRoutes[step];
    if (targetRoute && targetRoute !== router.pathname) {
      router.push(targetRoute).then(() => {
        // Small delay to ensure navigation completes
        setTimeout(() => {
          setCurrentStep(step);
        }, 500);
      });
    }
  };

  // Development controls (only show in dev mode for admin users)
  const showDevControls = process.env.NODE_ENV !== 'production' && userRole === 'Admin';

  return (
    <>
      {children}
      {showDevControls && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'white',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 9999,
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Tour Controls (Dev Only)</h4>
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <button
              onClick={() => {
                localStorage.removeItem('skooltym_tour_completed');
                setIsOpen(true);
              }}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start Tour
            </button>
            <button
              onClick={() => {
                localStorage.setItem('skooltym_tour_completed', 'true');
                setIsOpen(false);
              }}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset Tour
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface SkooltymTourProviderProps {
  children: ReactNode;
}

const SkooltymTourProvider: React.FC<SkooltymTourProviderProps> = ({ children }) => {
  return (
    <ReactTourProvider
      steps={steps}
      onClickClose={(props) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('skooltym_tour_completed', 'true');
        }
        props.setIsOpen(false);
      }}
      afterOpen={(target) => {
        if (target) {
          // Clean up previous highlights
          document.querySelectorAll('.sidebar-tour-highlight').forEach(el => {
            el.classList.remove('sidebar-tour-highlight');
          });

          // Add enhanced highlighting for sidebar items
          if (target.hasAttribute('data-tour')) {
            const tourTarget = target.getAttribute('data-tour');
            const sidebarTargets = ['change-password', 'settings', 'streams', 'classes', 'students', 'staff', 'guardians'];

            if (tourTarget && sidebarTargets.includes(tourTarget)) {
              target.classList.add('sidebar-tour-highlight');
            }
          }

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }}
      beforeClose={(props) => {
        // Clean up all tour highlights
        document.querySelectorAll('.sidebar-tour-highlight').forEach(el => {
          el.classList.remove('sidebar-tour-highlight');
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('skooltym_tour_completed', 'true');
        }
        return Promise.resolve();
      }}
      styles={{
        popover: (base: any, state: any) => {
          const currentStep = state?.currentStep ?? 0;
          const sidebarSteps = [1, 3, 5, 7, 9, 11, 13]; // Navigation steps for sidebar items
          const isSidebarStep = sidebarSteps.includes(currentStep);
          // handleStepChange(currentStep);
          return {
            ...base,
            borderRadius: 12,
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            maxWidth: isSidebarStep ? '350px' : '400px',
            zIndex: 10003,
            // Position within content area for sidebar steps
            marginLeft: isSidebarStep ? '20px' : undefined,
          };
        },
        maskWrapper: (base: any) => ({
          ...base,
          zIndex: 10001,
        }),
        maskArea: (base: any, state: any) => {
          // Enhanced highlighting for sidebar items
          const currentStep = state?.currentStep ?? 0;
          const sidebarSteps = [1, 3, 5, 7, 9, 11, 13];
          const isSidebarStep = sidebarSteps.includes(currentStep);

          return {
            ...base,
            rx: isSidebarStep ? 8 : 4,
            fill: isSidebarStep ? 'rgba(37, 99, 235, 0.2)' : 'rgba(0, 0, 0, 0.3)',
            stroke: isSidebarStep ? '#2563eb' : 'rgba(255, 255, 255, 0.3)',
            strokeWidth: isSidebarStep ? 3 : 1,
          };
        },
        badge: (base) => ({
          ...base,
          background: '#2563eb',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          minWidth: '24px',
          height: '24px',
          borderRadius: '12px',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }),
        close: (base) => ({
          ...base,
          right: '15px',
          top: '15px',
          width: '24px',
          height: '24px',
          border: 'none',
          background: 'rgba(107, 114, 128, 0.1)',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#6b7280',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(107, 114, 128, 0.2)',
            color: '#374151',
          },
        }),
      }}
    >
      <TourController>{children}</TourController>
    </ReactTourProvider>
  );
};

export default SkooltymTourProvider;
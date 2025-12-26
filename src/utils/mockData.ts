import { Contact } from '../types';

export type MockContactData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

// List of mock contact phone numbers to identify sample data
export const MOCK_CONTACT_PHONES = new Set([
  '+1 (555) 123-4567',
  '+1 (555) 234-5678',
  '+1 (555) 345-6789',
  '+1 (555) 456-7890',
  '+1 (555) 567-8901',
  '+1 (555) 678-9012',
  '+1 (555) 789-0123',
  '+1 (555) 890-1234',
  '+1 (555) 901-2345',
  '+1 (555) 012-3456',
  '+1 (555) 123-7890',
  '+1 (555) 234-8901',
  '+1 (555) 345-9012',
  '+1 (555) 456-0123',
  '+1 (555) 567-1234',
  '+1 (555) 678-2345',
  '+1 (555) 789-3456',
  '+1 (555) 890-4567',
  '+1 (555) 901-5678',
  '+1 (555) 012-6789',
]);

export function isMockContact(contact: Contact): boolean {
  return MOCK_CONTACT_PHONES.has(contact.phone);
}

export function generateMockContacts(folderIds: string[]): MockContactData[] {
  if (folderIds.length === 0) {
    return [];
  }

  // Distribute contacts across available folders
  const contacts: MockContactData[] = [
    // Founders/Executives
    {
      name: 'Sarah Chen',
      phone: '+1 (555) 123-4567',
      company: 'TechStart Inc.',
      role: 'CEO & Founder',
      linkedin: 'https://linkedin.com/in/sarahchen',
      notes: 'Met at TechCrunch Disrupt 2024. Interested in Series A funding.',
      folders: folderIds.slice(0, 1),
    },
    {
      name: 'Michael Rodriguez',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Labs',
      role: 'Co-Founder',
      linkedin: 'https://linkedin.com/in/michaelrodriguez',
      notes: 'Previous exit: $50M acquisition. Looking for new opportunities.',
      folders: folderIds.slice(0, 1),
    },
    {
      name: 'Emily Watson',
      phone: '+1 (555) 345-6789',
      company: 'DataFlow Systems',
      role: 'CTO',
      linkedin: 'https://linkedin.com/in/emilywatson',
      folders: folderIds.slice(0, 1),
    },

    // Engineers
    {
      name: 'James Park',
      phone: '+1 (555) 456-7890',
      company: 'CloudScale',
      role: 'Senior Software Engineer',
      linkedin: 'https://linkedin.com/in/jamespark',
      notes: 'Expert in React and Node.js. Open to consulting projects.',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },
    {
      name: 'Priya Patel',
      phone: '+1 (555) 567-8901',
      company: 'DevOps Solutions',
      role: 'Full Stack Developer',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },
    {
      name: 'David Kim',
      phone: '+1 (555) 678-9012',
      company: 'CodeCraft',
      role: 'Frontend Engineer',
      linkedin: 'https://linkedin.com/in/davidkim',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },
    {
      name: 'Lisa Anderson',
      phone: '+1 (555) 789-0123',
      company: 'TechInnovate',
      role: 'Backend Engineer',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },

    // GTM/Sales
    {
      name: 'Robert Taylor',
      phone: '+1 (555) 890-1234',
      company: 'SalesForce Pro',
      role: 'VP of Sales',
      linkedin: 'https://linkedin.com/in/roberttaylor',
      notes: 'Closed $5M+ deals annually. Excellent network in enterprise software.',
      folders: folderIds.length > 2 ? folderIds.slice(2, 3) : folderIds.slice(0, 1),
    },
    {
      name: 'Jessica Martinez',
      phone: '+1 (555) 901-2345',
      company: 'MarketGrow',
      role: 'Head of Marketing',
      linkedin: 'https://linkedin.com/in/jessicamartinez',
      folders: folderIds.length > 2 ? folderIds.slice(2, 3) : folderIds.slice(0, 1),
    },
    {
      name: 'Christopher Brown',
      phone: '+1 (555) 012-3456',
      company: 'GrowthHackers',
      role: 'Growth Lead',
      folders: folderIds.length > 2 ? folderIds.slice(2, 3) : folderIds.slice(0, 1),
    },

    // Investors
    {
      name: 'Alexandra Williams',
      phone: '+1 (555) 123-7890',
      company: 'Venture Capital Partners',
      role: 'Partner',
      linkedin: 'https://linkedin.com/in/alexandrawilliams',
      notes: 'Focus: B2B SaaS, Series A/B. Portfolio includes 3 unicorns.',
      folders: folderIds.length > 3 ? folderIds.slice(3, 4) : folderIds.slice(0, 1),
    },
    {
      name: 'Thomas Johnson',
      phone: '+1 (555) 234-8901',
      company: 'Seed Ventures',
      role: 'Managing Director',
      linkedin: 'https://linkedin.com/in/thomasjohnson',
      folders: folderIds.length > 3 ? folderIds.slice(3, 4) : folderIds.slice(0, 1),
    },
    {
      name: 'Amanda White',
      phone: '+1 (555) 345-9012',
      company: 'Angel Investors Network',
      role: 'Angel Investor',
      folders: folderIds.length > 3 ? folderIds.slice(3, 4) : folderIds.slice(0, 1),
    },

    // UI/UX Designers
    {
      name: 'Ryan Garcia',
      phone: '+1 (555) 456-0123',
      company: 'Design Studio Pro',
      role: 'Senior UX Designer',
      linkedin: 'https://linkedin.com/in/ryangarcia',
      notes: 'Award-winning designer. Specializes in mobile apps and SaaS platforms.',
      folders: folderIds.length > 4 ? folderIds.slice(4, 5) : folderIds.slice(0, 1),
    },
    {
      name: 'Sophie Lee',
      phone: '+1 (555) 567-1234',
      company: 'Creative Labs',
      role: 'UI Designer',
      folders: folderIds.length > 4 ? folderIds.slice(4, 5) : folderIds.slice(0, 1),
    },

    // Additional contacts with varying data completeness
    {
      name: 'Daniel Moore',
      phone: '+1 (555) 678-2345',
      company: 'TechCorp',
      role: 'Product Manager',
      folders: folderIds.slice(0, 1),
    },
    {
      name: 'Olivia Davis',
      phone: '+1 (555) 789-3456',
      company: 'StartupHub',
      folders: folderIds.slice(0, 1),
    },
    {
      name: 'Kevin Wilson',
      phone: '+1 (555) 890-4567',
      role: 'Consultant',
      linkedin: 'https://linkedin.com/in/kevinwilson',
      folders: folderIds.slice(0, 1),
    },
    {
      name: 'Rachel Green',
      phone: '+1 (555) 901-5678',
      company: 'Innovation Labs',
      role: 'Research Scientist',
      notes: 'PhD in Computer Science. Published 20+ papers.',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },
    {
      name: 'Brian Adams',
      phone: '+1 (555) 012-6789',
      company: 'Enterprise Solutions',
      role: 'Solutions Architect',
      linkedin: 'https://linkedin.com/in/brianadams',
      folders: folderIds.length > 1 ? folderIds.slice(1, 2) : folderIds.slice(0, 1),
    },
  ];

  return contacts;
}


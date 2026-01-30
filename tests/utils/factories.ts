import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

/**
 * Test data factory for User model
 * @param overrides - Partial User object to override defaults
 * @returns Complete User object with fake data
 *
 * @example
 * const user = createUser();
 * const adminUser = createUser({ role: 'admin' });
 */
export function createUser(overrides?: Partial<{
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}>) {
  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: false,
    image: null,
    role: null,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Test data factory for Organization model
 * @param overrides - Partial Organization object to override defaults
 * @returns Complete Organization object with fake data
 *
 * @example
 * const org = createOrganization();
 * const customOrg = createOrganization({ name: 'Acme Corp' });
 */
export function createOrganization(overrides?: Partial<{
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  createdAt: Date;
}>) {
  const name = overrides?.name || faker.company.name();
  const slug = overrides?.slug || faker.helpers.slugify(name).toLowerCase();

  return {
    id: randomUUID(),
    name,
    slug,
    logo: null,
    metadata: null,
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Test data factory for Member model
 * @param overrides - Partial Member object to override defaults (organizationId and userId required)
 * @returns Complete Member object with fake data
 *
 * @example
 * const member = createMember({ organizationId: 'org-1', userId: 'user-1' });
 */
export function createMember(overrides?: Partial<{
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
}>) {
  if (!overrides?.organizationId || !overrides?.userId) {
    throw new Error('createMember requires organizationId and userId in overrides');
  }

  return {
    id: randomUUID(),
    organizationId: overrides.organizationId,
    userId: overrides.userId,
    role: 'member',
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Test data factory for ContactQuery model
 * @param overrides - Partial ContactQuery object to override defaults
 * @returns Complete ContactQuery object with fake data
 *
 * @example
 * const query = createContactQuery();
 * const customQuery = createContactQuery({ subject: 'Custom subject' });
 */
export function createContactQuery(overrides?: Partial<{
  id: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  messageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}>) {
  return {
    id: randomUUID(),
    email: faker.internet.email(),
    subject: faker.lorem.sentence(),
    message: faker.lorem.paragraphs(2),
    status: 'unread',
    messageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Test data factory for ContactReply model
 * @param overrides - Partial ContactReply object to override defaults (queryId required)
 * @returns Complete ContactReply object with fake data
 *
 * @example
 * const reply = createContactReply({ queryId: 'query-1' });
 */
export function createContactReply(overrides?: Partial<{
  id: string;
  queryId: string;
  message: string;
  messageId: string | null;
  sentBy: string;
  createdAt: Date;
}>) {
  if (!overrides?.queryId) {
    throw new Error('createContactReply requires queryId in overrides');
  }

  return {
    id: randomUUID(),
    queryId: overrides.queryId,
    message: faker.lorem.paragraphs(1),
    messageId: null,
    sentBy: faker.internet.email(),
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Test data factory for Session model
 * @param overrides - Partial Session object to override defaults (userId required)
 * @returns Complete Session object with fake data
 *
 * @example
 * const session = createSession({ userId: 'user-1' });
 */
export function createSession(overrides?: Partial<{
  id: string;
  expiresAt: Date;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  impersonatedBy: string | null;
  activeOrganizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}>) {
  if (!overrides?.userId) {
    throw new Error('createSession requires userId in overrides');
  }

  return {
    id: randomUUID(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    token: randomUUID(),
    userId: overrides.userId,
    ipAddress: null,
    userAgent: null,
    impersonatedBy: null,
    activeOrganizationId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

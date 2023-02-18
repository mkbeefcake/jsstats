import * as Types from '../__generated__/baseTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {} as const;

export type CouncilMemberFragment = { __typename: 'CouncilMember', electedInCouncilId: string, member: { handle: string } };

import * as Types from './baseTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetMembersCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MembershipWhereInput>;
}>;


export type GetMembersCountQuery = { __typename: 'Query', membershipsConnection: { __typename: 'MembershipConnection', totalCount: number } };

export type GetMembersQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MembershipWhereInput>;
  orderBy?: Types.InputMaybe<Array<Types.MembershipOrderByInput> | Types.MembershipOrderByInput>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetMembersQuery = { __typename: 'Query', memberships: Array<{ __typename: 'Membership', id: string, rootAccount: string, controllerAccount: string, boundAccounts: Array<string>, handle: string, isVerified: boolean, isFoundingMember: boolean, isCouncilMember: boolean, inviteCount: number, createdAt: any, metadata: { __typename: 'MemberMetadata', name?: string | null, about?: string | null, avatar?: { __typename: 'AvatarObject' } | { __typename: 'AvatarUri', avatarUri: string } | null }, roles: Array<{ __typename: 'Worker', id: string, createdAt: any, isLead: boolean, group: { __typename: 'WorkingGroup', name: string } }>, stakingaccountaddedeventmember?: Array<{ __typename: 'StakingAccountAddedEvent', createdAt: any, inBlock: number, network: Types.Network, account: string }> | null }> };

export type GetInvitedMembersCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MemberInvitedEventWhereInput>;
}>;


export type GetInvitedMembersCountQuery = { __typename: 'Query', memberInvitedEventsConnection: { __typename: 'MemberInvitedEventConnection', totalCount: number } };

export type GetInvitedMembersQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.MemberInvitedEventWhereInput>;
  orderBy?: Types.InputMaybe<Array<Types.MemberInvitedEventOrderByInput> | Types.MemberInvitedEventOrderByInput>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetInvitedMembersQuery = { __typename: 'Query', memberInvitedEvents: Array<{ __typename: 'MemberInvitedEvent', id: string, createdAt: any, invitingMember: { __typename: 'Membership', id: string, rootAccount: string, controllerAccount: string, boundAccounts: Array<string>, handle: string, isVerified: boolean, isFoundingMember: boolean, isCouncilMember: boolean, inviteCount: number, createdAt: any, metadata: { __typename: 'MemberMetadata', name?: string | null, about?: string | null, avatar?: { __typename: 'AvatarObject' } | { __typename: 'AvatarUri', avatarUri: string } | null }, roles: Array<{ __typename: 'Worker', id: string, createdAt: any, isLead: boolean, group: { __typename: 'WorkingGroup', name: string } }>, stakingaccountaddedeventmember?: Array<{ __typename: 'StakingAccountAddedEvent', createdAt: any, inBlock: number, network: Types.Network, account: string }> | null }, newMember: { __typename: 'Membership', id: string, rootAccount: string, controllerAccount: string, boundAccounts: Array<string>, handle: string, isVerified: boolean, isFoundingMember: boolean, isCouncilMember: boolean, inviteCount: number, createdAt: any, metadata: { __typename: 'MemberMetadata', name?: string | null, about?: string | null, avatar?: { __typename: 'AvatarObject' } | { __typename: 'AvatarUri', avatarUri: string } | null }, roles: Array<{ __typename: 'Worker', id: string, createdAt: any, isLead: boolean, group: { __typename: 'WorkingGroup', name: string } }>, stakingaccountaddedeventmember?: Array<{ __typename: 'StakingAccountAddedEvent', createdAt: any, inBlock: number, network: Types.Network, account: string }> | null } }> };

export type MemberFieldsFragment = { __typename: 'Membership', id: string, rootAccount: string, controllerAccount: string, boundAccounts: Array<string>, handle: string, isVerified: boolean, isFoundingMember: boolean, isCouncilMember: boolean, inviteCount: number, createdAt: any, metadata: { __typename: 'MemberMetadata', name?: string | null, about?: string | null, avatar?: { __typename: 'AvatarObject' } | { __typename: 'AvatarUri', avatarUri: string } | null }, roles: Array<{ __typename: 'Worker', id: string, createdAt: any, isLead: boolean, group: { __typename: 'WorkingGroup', name: string } }>, stakingaccountaddedeventmember?: Array<{ __typename: 'StakingAccountAddedEvent', createdAt: any, inBlock: number, network: Types.Network, account: string }> | null };

export const MemberFieldsFragmentDoc = gql`
    fragment MemberFields on Membership {
  id
  rootAccount
  controllerAccount
  boundAccounts
  handle
  metadata {
    name
    about
    avatar {
      __typename
      ... on AvatarUri {
        avatarUri
        __typename
      }
    }
    __typename
  }
  isVerified
  isFoundingMember
  isCouncilMember
  inviteCount
  roles {
    id
    group {
      name
      __typename
    }
    createdAt
    isLead
    __typename
  }
  createdAt
  stakingaccountaddedeventmember {
    createdAt
    inBlock
    network
    account
    __typename
  }
  __typename
}
    `;
export const GetMembersCountDocument = gql`
    query GetMembersCount($where: MembershipWhereInput) {
  membershipsConnection(where: $where) {
    totalCount
    __typename
  }
}
    `;

/**
 * __useGetMembersCountQuery__
 *
 * To run a query within a React component, call `useGetMembersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMembersCountQuery(baseOptions?: Apollo.QueryHookOptions<GetMembersCountQuery, GetMembersCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersCountQuery, GetMembersCountQueryVariables>(GetMembersCountDocument, options);
      }
export function useGetMembersCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersCountQuery, GetMembersCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersCountQuery, GetMembersCountQueryVariables>(GetMembersCountDocument, options);
        }
export type GetMembersCountQueryHookResult = ReturnType<typeof useGetMembersCountQuery>;
export type GetMembersCountLazyQueryHookResult = ReturnType<typeof useGetMembersCountLazyQuery>;
export type GetMembersCountQueryResult = Apollo.QueryResult<GetMembersCountQuery, GetMembersCountQueryVariables>;
export const GetMembersDocument = gql`
    query GetMembers($where: MembershipWhereInput, $orderBy: [MembershipOrderByInput!], $offset: Int, $limit: Int) {
  memberships(where: $where, orderBy: $orderBy, offset: $offset, limit: $limit) {
    ...MemberFields
    __typename
  }
}
    ${MemberFieldsFragmentDoc}`;

/**
 * __useGetMembersQuery__
 *
 * To run a query within a React component, call `useGetMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
      }
export function useGetMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
        }
export type GetMembersQueryHookResult = ReturnType<typeof useGetMembersQuery>;
export type GetMembersLazyQueryHookResult = ReturnType<typeof useGetMembersLazyQuery>;
export type GetMembersQueryResult = Apollo.QueryResult<GetMembersQuery, GetMembersQueryVariables>;
export const GetInvitedMembersCountDocument = gql`
    query GetInvitedMembersCount($where: MemberInvitedEventWhereInput) {
  memberInvitedEventsConnection(where: $where) {
    totalCount
  }
}
    `;

/**
 * __useGetInvitedMembersCountQuery__
 *
 * To run a query within a React component, call `useGetInvitedMembersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitedMembersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitedMembersCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetInvitedMembersCountQuery(baseOptions?: Apollo.QueryHookOptions<GetInvitedMembersCountQuery, GetInvitedMembersCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvitedMembersCountQuery, GetInvitedMembersCountQueryVariables>(GetInvitedMembersCountDocument, options);
      }
export function useGetInvitedMembersCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvitedMembersCountQuery, GetInvitedMembersCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvitedMembersCountQuery, GetInvitedMembersCountQueryVariables>(GetInvitedMembersCountDocument, options);
        }
export type GetInvitedMembersCountQueryHookResult = ReturnType<typeof useGetInvitedMembersCountQuery>;
export type GetInvitedMembersCountLazyQueryHookResult = ReturnType<typeof useGetInvitedMembersCountLazyQuery>;
export type GetInvitedMembersCountQueryResult = Apollo.QueryResult<GetInvitedMembersCountQuery, GetInvitedMembersCountQueryVariables>;
export const GetInvitedMembersDocument = gql`
    query GetInvitedMembers($where: MemberInvitedEventWhereInput, $orderBy: [MemberInvitedEventOrderByInput!], $offset: Int, $limit: Int) {
  memberInvitedEvents(
    where: $where
    orderBy: $orderBy
    offset: $offset
    limit: $limit
  ) {
    id
    createdAt
    invitingMember {
      ...MemberFields
    }
    newMember {
      ...MemberFields
    }
  }
}
    ${MemberFieldsFragmentDoc}`;

/**
 * __useGetInvitedMembersQuery__
 *
 * To run a query within a React component, call `useGetInvitedMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitedMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitedMembersQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetInvitedMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetInvitedMembersQuery, GetInvitedMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvitedMembersQuery, GetInvitedMembersQueryVariables>(GetInvitedMembersDocument, options);
      }
export function useGetInvitedMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvitedMembersQuery, GetInvitedMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvitedMembersQuery, GetInvitedMembersQueryVariables>(GetInvitedMembersDocument, options);
        }
export type GetInvitedMembersQueryHookResult = ReturnType<typeof useGetInvitedMembersQuery>;
export type GetInvitedMembersLazyQueryHookResult = ReturnType<typeof useGetInvitedMembersLazyQuery>;
export type GetInvitedMembersQueryResult = Apollo.QueryResult<GetInvitedMembersQuery, GetInvitedMembersQueryVariables>;
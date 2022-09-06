import React, { useEffect, useState } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,

} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
};

export function Dashboard() {

    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransaction() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];



        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {
                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'

                    });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }
            });

        setData(transactionsFormatted);
    }

    useEffect(() => {
        loadTransaction();
    }, []);

    return (
        <Container>
            <Header>
                <UserWrapper >
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/5634272?v=4' }}
                        />
                        <User>
                            <UserGreeting>Olá</UserGreeting>
                            <UserName>Luís</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => { }}>
                        <Icon name='power' />
                    </LogoutButton>

                </UserWrapper>
            </Header>
            <HighlightCards>
                <HighlightCard
                    type="up"
                    title='Entradas'
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 03 de abril"
                />
                <HighlightCard
                    type="down"
                    title='Saídas'
                    amount="R$ 1.259,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="total"
                    title='Total'
                    amount="R$ 16.141,00"
                    lastTransaction="01 à 16 de abril"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />


            </Transactions>
        </Container >
    )
}

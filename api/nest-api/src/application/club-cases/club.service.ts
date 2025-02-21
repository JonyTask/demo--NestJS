import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/domain/prisma/prisma.service";
import { LeagueType } from "src/infrastructure/types/league.type";
import { NumEachLeague } from "src/infrastructure/types/league.type";
import { SerializeBigInt } from "src/infrastructure/utils/serialize";
import { ClubDto } from "./dto/club.dto";
import { plainToInstance } from "class-transformer";

@Injectable({})
export class ClubService {
    constructor(private readonly prisma: PrismaService) {}

    async listUpAllClubs(){
        try {
            const clubs = await this.prisma.club.findMany();
            const dtoClubs = clubs.map(club => plainToInstance( ClubDto, club ));
            // BigInt を文字列に変換してから返す
            return SerializeBigInt.serialize(dtoClubs);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            throw error;
        }
    }

    async fetchClubsByLeague(league: LeagueType) {
        try {
            const leagueNum: number = NumEachLeague[`${league}`];
            const clubs = await this.prisma.club.findMany({
                where: {
                    league_id: leagueNum
                }
            });
            const dtoClubs = clubs.map(club => plainToInstance(ClubDto, club));
            return SerializeBigInt.serialize(dtoClubs);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            throw error;
        }
    }
}
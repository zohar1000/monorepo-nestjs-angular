import { BaseService } from './base.service';
import { AuthUser } from '../models/auth-user.model';
import { GetItemsResponse } from '@shared-all/models/paging/get-items-response.model';
import { Repository } from 'typeorm';

export abstract class BaseEntityService extends BaseService {
  protected constructor(protected entityName, protected repository: Repository<any>) {
    super();
  }

  /*********************/
  /*      F I N D      */
  /*********************/

  findOne(query): Promise<any> {
    return this.repository.findOne({ where: query });
  }

  findOneById(id): Promise<any> {
    return this.repository.findOne({ where: { _id: id } });
  }

  getProfileById(id): Promise<any> {
    return this.repository.findOne({ where: { _id: id }, select: this.getEntitySelectedFields() });
  }

  findMany(query): Promise<any[]> {
    return this.repository.find(query);
  }

  findAll(): Promise<any[]> {
    return this.repository.find();
  }

  getProfiles(query): Promise<any[]> {
    return this.repository.find({ where: query, select: this.getEntitySelectedFields() });
  }


  /************************/
  /*     I N S E R T      */
  /************************/

  async insertOne(doc: any): Promise<any> {
    return this.repository.save(doc);
  }

  // async insertOneAutoIncrement(firstId: number, doc: any): Promise<any> {
  //   return this.mongoService.insertOneAutoIncrement(firstId, this.collectionName, doc);
  // }
  //
  // async insertMany(docs: any[]): Promise<any> {
  //   return this.mongoService.insertMany(this.collectionName, docs);
  // }

  /*************************/
  /*      U P D A T E      */
  /*************************/

  // async updateOne(query, fields): Promise<any> {
  //   return this.mongoService.updateOne(this.collectionName, query, fields);
  // }

  async updateById(id, fields): Promise<any> {
    return this.repository.update({ _id: id }, fields);
  }

  /*************************/
  /*      D E L E T E      */
  /*************************/

  // async deleteOne(query): Promise<any> {
  //   return this.mongoService.deleteOne(this.collectionName, query);
  // }
  //
  // async deleteById(id): Promise<any> {
  //   return this.deleteOne({ _id: id });
  // }
  //
  // async deleteMany(query): Promise<any> {
  //   return this.mongoService.deleteMany(this.collectionName, query);
  // }


  /**********************/
  /*    P A G I N G     */
  /**********************/

  async getItemsPage(user: AuthUser, body): Promise<GetItemsResponse> {
    return new Promise<GetItemsResponse>(async (resolve, reject) => {
      try {
        const query: any = await this.getPageFilterQuery(body.filter);
        const [list, count] = await this.repository.findAndCount({
          select: this.getEntitySelectedFields(),
          where: query,
          order: { [body.sort.key]: body.sort.order },
          skip: body.paging.pageIndex * body.paging.pageSize,
          take: body.paging.pageSize
        });
        resolve({ items: list, totalCount: count });

        // let totalCount;
        // const opts: ZMongoReadOpts = {
        //   skip: body.paging.pageIndex * body.paging.pageSize,
        //   limit: body.paging.pageSize,
        //   sort: { [this.externalIdKey && this.getDbIdKey(body.sort.key)]: body.sort.order }
        // }
        // const reqs: Promise<any>[] = [this.mongoService.findMany(this.collectionName, query, {}, opts)];
        // if (body.isTotalCount) reqs.push(this.mongoService.count(this.collectionName, query));
        // const responses = await Promise.all(reqs);
        // const items = responses[0].map(doc => this.getProfileFromDoc(doc));
        // if (body.isTotalCount) totalCount = responses[1];
        // resolve({ items, totalCount });
      } catch (e) {
        this.loge(`error getting ${this.entityName} page`, e, body);
        reject(e);
      }
    });
  }

  abstract getEntitySelectedFields();

  protected getPageFilterQuery(reqFilter: {}) {
    const query: any = {};
    for (const key in reqFilter) {
      if (reqFilter[key] !== '') {
        if (Array.isArray(reqFilter[key])) {
          query[this.getDbIdKey(key)] = { $in: reqFilter[key] };
        } else {
          query[this.getDbIdKey(key)] = reqFilter[key];
        }
      }
    }
    return query;
  }

  getDbIdKey(key) {
    // return key === this.externalIdKey ? '_id' : key;
    return '_id';  // always _id for mongo
  }

  // aggregate(query) {
  //   return new Promise(async(resolve, reject) => {
  //     await this.model.aggregate(query).exec((err, result) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     });
  //   });
  // }


  /***********************/
  /*    P R O F I L E    */
  /***********************/

  // getProfileFromDoc(doc): any {
  //   return ZObj.clone(doc, this.profileKeys);
  // }

  // async getAllProfiles(query?, projection?, opts?) {
  //   return new Promise<any[]>(async (resolve, reject) => {
  //     try {
  //       const docs: any[] = await this.findMany(query, projection, opts);
  //       const profiles = docs.map(doc => this.getProfileFromDoc(doc));
  //       resolve(profiles);
  //     } catch (e) {
  //       this.loge(`error getting all ${this.entityName}`, e);
  //       reject(e);
  //     }
  //   });
  // }

  // async getProfileById(id) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const doc = await this.findById(id);
  //       if (!doc) this.logiAndThrow(`${this.entityName} not found`, id);
  //       const profile = this.getProfileFromDoc(doc);
  //       resolve(profile);
  //     } catch (e) {
  //       this.loge(`error getting ${this.entityName} profile`, e, id);
  //       reject(e);
  //     }
  //   });
  // }
}

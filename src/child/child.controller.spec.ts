import { Test, TestingModule } from '@nestjs/testing';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';
import { RemoveAssignementDto } from './dto/remove-assignement.dto';
import { Response } from 'express';

describe('ChildController', () => {
  let controller: ChildController;
  let service: ChildService;

  const mockChildren = [
    { id: 1, firstname: 'John', lastname: 'Doe', userId: 1 },
    { id: 2, firstname: 'Jane', lastname: 'Doe', userId: 2 },
  ];

  const mockChildService = {
    findChildrenByChildCare: jest.fn().mockResolvedValue(mockChildren),
    createOrUpdateChild: jest.fn().mockResolvedValue(mockChildren[0]),
    removeChildAssignment: jest.fn().mockResolvedValue(undefined),
    exportChildren: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildController],
      providers: [
        {
          provide: ChildService,
          useValue: mockChildService,
        },
      ],
    }).compile();

    controller = module.get<ChildController>(ChildController);
    service = module.get<ChildService>(ChildService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findChildrenByChildCare', () => {
    it('should return children for a given child care ID', async () => {
      const params: FindOneParamsDto = { id: 1 };
      const result = await controller.findChildrenByChildCare(params);
      expect(result).toEqual(mockChildren);
      expect(service.findChildrenByChildCare).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new child', async () => {
      const createChildDto: CreateChildDto = {
        firstname: 'John',
        lastname: 'Doe',
        childCareId: 1,
      };
      const username = 'john';

      const result = await controller.create(createChildDto, username);
      expect(result).toEqual(mockChildren[0]);
      expect(service.createOrUpdateChild).toHaveBeenCalledWith(
        createChildDto,
        username,
      );
    });

    it('should throw ForbiddenException if X-Auth header is missing', async () => {
      const createChildDto: CreateChildDto = {
        firstname: 'John',
        lastname: 'Doe',
        childCareId: 1,
      };
      await expect(controller.create(createChildDto, '')).rejects.toThrow(
        'Missing X-Auth header',
      );
    });
  });

  describe('removeAssignment', () => {
    it('should remove a child assignment from a child care', async () => {
      const removeAssignementDto: RemoveAssignementDto = {
        childCareId: 1,
        childId: 2,
      };
      const username = 'john';

      await controller.removeAssignment(removeAssignementDto, username);
      expect(service.removeChildAssignment).toHaveBeenCalledWith(
        removeAssignementDto.childCareId,
        removeAssignementDto.childId,
        username,
      );
    });

    it('should throw ForbiddenException if X-Auth header is missing', async () => {
      const removeAssignementDto: RemoveAssignementDto = {
        childCareId: 1,
        childId: 2,
      };
      await expect(
        controller.removeAssignment(removeAssignementDto, ''),
      ).rejects.toThrow('Missing X-Auth header');
    });
  });

  describe('exportChildren', () => {
    it('should set headers and call exportChildren on the service', async () => {
      const childCareId = 1;
      const res = {
        setHeader: jest.fn(),
        set: jest.fn(),
      } as unknown as Response;

      await controller.exportChildren(childCareId, res);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="children_export.csv"',
      );
      expect(service.exportChildren).toHaveBeenCalledWith(res, childCareId);
    });
  });
});
